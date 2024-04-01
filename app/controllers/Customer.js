const path = require('path');
const customerModel = require(path.join(__dirname, '..', 'models', 'api', 'CustomerModel'));
const customerValidation = require(path.join(__dirname, '..', 'utils', 'validation', 'CustomerValidation'));
const customerHandler = require(path.join(__dirname, '..', 'utils', 'handler', 'CustomerHandler'));
const helper = require(path.join(__dirname, '..', 'utils', 'CustomHelper'));
const tokenVerification = require(path.join(__dirname, '..', 'utils', 'TokenVerification'));
const nodeInputValidation = require('node-input-validator');
const jwt = require('jsonwebtoken');

module.exports = {
    async login(req, res) {
        try {
            const validator = new nodeInputValidation(req.body, {
                email: 'required|email',
                password: 'required'
            });

            const isValid = await validator.check();
            if (!isValid) {
                return helper.display(res, customerValidation.message(validator.errors));
            }

            const encryptedPassword = helper.enCryptPassword(req.body.password, req.body.email);
            const customerData = {
                email: req.body.email,
                password: encryptedPassword
            };

            const response = await customerModel.auth(customerData);

            if (response === false) {
                return helper.display(res, {'code': 'USR_01', 'message': 'Email or Password is invalid.'});
            } else if (response === null) {
                return helper.display(res, {'code': 'USR_05', 'message': 'The email does not exist.'});
            } else {
                const tokenData = {
                    customer_id: response.customer_id,
                    name: response.name,
                    email: response.email,
                    role: 'customer'
                };

                const token = jwt.sign({ data: tokenData }, process.env.AUTH_SECRET_TOKEN, { expiresIn: process.env.AUTH_TOKEN_TIME });

                const output = {
                    'customer': response,
                    'accessToken': 'Bearer ' + token,
                    'expires_in': process.env.AUTH_TOKEN_TIME
                };

                helper.display(res, output, 200);
            }
        } catch (error) {
            helper.display(res, {'code': 'USR_10', 'message': error.message});
        }
    },
    async register(req, res) {
        try {
            const validator = new nodeInputValidation(req.body, {
                name: 'required|string',
                email: 'required|email',
                password: 'required'
            });

            const isValid = await validator.check();
            if (!isValid) {
                return helper.display(res, customerValidation.message(validator.errors));
            }

            const output = await this.registerCustomer(req.body);
            helper.display(res, output, 200);
        } catch (err) {
            helper.display(res, { 'code': 'USR_10', 'message': err });
        }
    },
    async registerCustomer(data) {
        try {
            const encryptedPassword = helper.enCryptPassword(data.password, data.email);
            const customerData = {
                name: data.name,
                email: data.email,
                password: encryptedPassword
            };

            const record = await customerModel.insertRow(customerData, 'customer_id');
            const response = await customerModel.getRow('*', { customer_id: record });

            if (response === 'NotFound') {
                throw { 'code': 'USR_05', 'message': 'Record does not exist' };
            }

            const tokenData = {
                customer_id: response.customer_id,
                name: response.name,
                email: response.email,
                role: 'customer'
            };

            const token = jwt.sign({ data: tokenData }, process.env.AUTH_SECRET_TOKEN, { expiresIn: process.env.AUTH_TOKEN_TIME });

            const output = {
                'customer': { 'schema': response },
                'accessToken': 'Bearer ' + token,
                'expires_in': process.env.AUTH_TOKEN_TIME
            };

            return output;
        } catch (err) {
            if (err.original !== undefined) {
                if (err.original.code === 'ER_DUP_ENTRY') {
                    throw { 'code': 'USR_04', 'message': 'The email already exists.' };
                } else {
                    throw { 'code': 'USR_10', 'message': err.original.sqlMessage };
                }
            }
        }
    },
    async updateProfile(req, res) {
        try {
            const validator = new nodeInputValidation(req.body, {
                name: 'required',
                email: 'required|email',
                day_phone: 'phoneNumber',
                eve_phone: 'phoneNumber',
                mob_phone: 'phoneNumber'
            });

            const isValid = await validator.check();
            if (!isValid) {
                return helper.display(res, customerValidation.message(validator.errors));
            }

            const customerToken = tokenVerification.verify(req, res, jwt);
            if (!customerToken.data) {
                return helper.display(res, customerToken);
            }

            const { name, email, day_phone, eve_phone, mob_phone, password } = req.body;
            const requestData = {
                name,
                email,
                day_phone: day_phone || null,
                eve_phone: eve_phone || null,
                mob_phone: mob_phone || null
            };

            if (password !== undefined) {
                requestData.password = helper.enCryptPassword(password, email);
            }

            const customerData = { customer_id: customerToken.data.customer_id };
            customerHandler.update(req, res, customerData, requestData, customerModel, helper);
        } catch (error) {
            helper.display(res, {'code': 'USR_10', 'message': error.message});
        }
    },
    async updateAddress(req, res) {
        try {
            const validator = new nodeInputValidation(req.body, {
                address_1: 'required',
                city: 'required',
                region: 'required',
                postal_code: 'required',
                country: 'required',
                shipping_region_id: 'required|integer'
            });

            const isValid = await validator.check();
            if (!isValid) {
                return helper.display(res, customerValidation.message(validator.errors));
            }

            const customerToken = tokenVerification.verify(req, res, jwt);
            if (!customerToken.data) {
                return helper.display(res, customerToken);
            }

            const requestData = {
                address_1: req.body.address_1,
                address_2: req.body.address_2 || null,
                city: req.body.city,
                region: req.body.region,
                postal_code: req.body.postal_code,
                country: req.body.country,
                shipping_region_id: req.body.shipping_region_id
            };

            const customerData = { customer_id: customerToken.data.customer_id };
            customerHandler.update(req, res, customerData, requestData, customerModel, helper);
        } catch (error) {
            helper.display(res, {'code': 'USR_10', 'message': error.message});
        }
    },
    async updateCreditCard(req, res) {
        try {
            const validator = new nodeInputValidation(req.body, {
                credit_card: 'required|creditCard'
            });

            const isValid = await validator.check();
            if (!isValid) {
                return helper.display(res, customerValidation.message(validator.errors));
            }

            const customerToken = tokenVerification.verify(req, res, jwt);
            if (!customerToken.data) {
                return helper.display(res, customerToken);
            }

            const requestData = {
                credit_card: req.body.credit_card
            };

            const customerData = { customer_id: customerToken.data.customer_id };
            customerHandler.update(req, res, customerData, requestData, customerModel, helper);
        } catch (error) {
            helper.display(res, {'code': 'USR_10', 'message': error.message});
        }
    }
};