const customerModel = require(__dirname + "/../models/api/CustomerModel");
const customerValidation = require(__dirname + "/../modules/CustomerValidation");
const customer = require(__dirname + '/../modules/CustomerHandler');
const helper = require(__dirname + '/../modules/CustomHelper');
const verification = require(__dirname + '/../modules/TokenVerification');
const v = require('node-input-validator');
const jwt = require('jsonwebtoken');

const validation = new customerValidation();

module.exports = {
    name: 'Customer',
    login: function(req, res, next) {
        // Set validation rule
        validator = new v(req.body, {
            email: 'required|email',
            password: 'required'
        });

        // Check validation
        validator.check().then(function(matched) {
            if (!matched) {
                helper.display(res, validation.message(validator.errors));
            } else {
                // Set auth data
                data = {
                    email: req.body.email,
                    password: helper.enCryptPassword(
                        req.body.password,
                        req.body.email
                    )
                };

                // DB read process 				
                customerModel.auth(data).then((response) => {
                    if (response == 'Invalid') {
                        helper.display(res, {
                            'code': 'USR_01',
                            'message': 'Email or Password is invalid.'
                        });
                    } else if (response == 'NotFound') {
                        helper.display(res, {
                            'code': 'USR_05',
                            'message': 'The email does not exist.'
                        });
                    } else {
                        // Set customer data
                        tokenData = {
                            customer_id: response.customer_id,
                            name: response.name,
                            email: response.email,
                            role: 'customer'
                        }

                        // Set bearer token
                        token = jwt.sign({
                                data: tokenData
                            },
                            process.env.AUTH_SECRET_TOKEN, {
                                expiresIn: process.env.AUTH_TOKEN_TIME
                            }
                        );

                        // Set response
                        output = {
                            'customer': response,
                            'accessToken': 'Bearer ' + token,
                            'expires_in': process.env.AUTH_TOKEN_TIME
                        };

                        // Return response
                        helper.display(res, output, 200);
                    }
                }).catch((err) => {
                    helper.display(res, {
                        'code': 'USR_10',
                        'message': err
                    });
                });
            }
        });
    },
    register: function(req, res, next) {
        // Set validation rule
        validator = new v(req.body, {
            name: 'required|string',
            email: 'required|email',
            password: 'required'
        });

        // Check validation
        validator.check().then(function(matched) {
            if (!matched) {
                helper.display(res, validation.message(validator.errors));
            } else {
                // Setting new customer data
                data = {
                    name: req.body.name,
                    email: req.body.email,
                    password: helper.enCryptPassword(
                        req.body.password,
                        req.body.email
                    )
                };

                // DB read and write process 		    		    	
                customerModel.insertRow(data, 'customer_id')
                    .then((record) => {
                        customerModel.getRow('*', {
                                customer_id: record
                            })
                            .then((response) => {
                                if (response == 'NotFound') {
                                    helper.display(res, {
                                        'code': 'USR_05',
                                        'message': 'Record does not exist'
                                    });
                                } else {
                                    // Set customer data
                                    tokenData = {
                                        customer_id: response.customer_id,
                                        name: response.name,
                                        email: response.email,
                                        role: 'customer'
                                    }

                                    // Set bearer token
                                    token = jwt.sign({
                                            data: tokenData
                                        },
                                        process.env.AUTH_SECRET_TOKEN, {
                                            expiresIn: process.env.AUTH_TOKEN_TIME
                                        }
                                    );

                                    // Set response
                                    output = {
                                        'customer': {
                                            'schema': response
                                        },
                                        'accessToken': 'Bearer ' + token,
                                        'expires_in': process.env.AUTH_TOKEN_TIME
                                    };

                                    // Return response
                                    helper.display(res, output, 200);
                                }
                            }).catch((err) => {
                                helper.display(res, ['USR_10', err]);
                            });
                    }).catch((err) => {
                        if (err.original !== undefined) {
                            if (err.original.code == 'ER_DUP_ENTRY') {
                                helper.display(res, {
                                    'code': 'USR_04',
                                    'message': 'The email already exists.'
                                });
                            } else {
                                helper.display(res, {
                                    'code': 'USR_10',
                                    'message': err.original.sqlMessage
                                });
                            }
                        }
                    });
            }
        });
    },
    updateProfile: function(req, res, next) {
        // Set validation rule
        validator = new v(req.body, {
            name: 'required',
            email: 'required|email',
            day_phone: 'phoneNumber',
            eve_phone: 'phoneNumber',
            mob_phone: 'phoneNumber'
        });

        // Check validation
        validator.check().then(function(matched) {
            if (!matched) {
                helper.display(res, validation.message(validator.errors));
            } else {
                // Check token
                customer_token = verification.verify(req, res, jwt);
                if (typeof customer_token.data == 'undefined') {
                    helper.display(res, customer_token);
                } else {
                    // Set new data
                    request_data = {
                        name: req.body.name,
                        email: req.body.email,
                        day_phone: (req.body.day_phone !== undefined) ?
                            req.body.day_phone : '',
                        eve_phone: (req.body.eve_phone !== undefined) ?
                            req.body.eve_phone : '',
                        mob_phone: (req.body.mob_phone !== undefined) ?
                            req.body.mob_phone : ''
                    };

                    if (req.body.password !== undefined) {
                        request_data.password = helper.enCryptPassword(
                            req.body.password,
                            req.body.email
                        );
                    }

                    // Setting customer data by token
                    customer_data = {
                        customer_id: customer_token.data.customer_id
                    };

                    // Update record
                    customer.update(
                        req,
                        res,
                        customer_data,
                        request_data,
                        customerModel,
                        helper
                    );
                }
            }
        });
    },
    updateAddress: function(req, res, next) {
        // Set validation rule
        validator = new v(req.body, {
            address_1: 'required',
            city: 'required',
            region: 'required',
            postal_code: 'required',
            country: 'required',
            shipping_region_id: 'required|integer'
        });

        // Check validation
        validator.check().then(function(matched) {
            if (!matched) {
                helper.display(res, validation.message(validator.errors));
            } else {
                // Check token
                customer_token = verification.verify(req, res, jwt);
                if (typeof customer_token.data == 'undefined') {
                    helper.display(res, customer_token);
                } else {
                    // Set new data
                    request_data = {
                        address_1: req.body.address_1,
                        address_2: (req.body.address_2 !== undefined) ?
                            req.body.address_2 : '',
                        city: req.body.city,
                        region: req.body.region,
                        postal_code: req.body.postal_code,
                        country: req.body.country,
                        shipping_region_id: req.body.shipping_region_id
                    };

                    // Setting customer data by token
                    customer_data = {
                        customer_id: customer_token.data.customer_id
                    };

                    // Update record
                    customer.update(
                        req,
                        res,
                        customer_data,
                        request_data,
                        customerModel,
                        helper
                    );
                }
            }
        });
    },
    updateCreditCard: function(req, res, next) {
        // Set validation rule
        validator = new v(req.body, {
            credit_card: 'required|creditCard'
        });

        // Check validation
        validator.check().then(function(matched) {
            if (!matched) {
                helper.display(res, validation.message(validator.errors));
            } else {
                // Check token
                customer_token = verification.verify(req, res, jwt);
                if (typeof customer_token.data == 'undefined') {
                    helper.display(res, customer_token);
                } else {
                    // Set new data
                    request_data = {
                        credit_card: req.body.credit_card
                    };

                    // Setting customer data by token
                    customer_data = {
                        customer_id: customer_token.data.customer_id
                    };

                    // Update record
                    customer.update(
                        req,
                        res,
                        customer_data,
                        request_data,
                        customerModel,
                        helper
                    );
                }
            }
        });
    }
}