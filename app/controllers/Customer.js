const customerModel = require(__dirname + "/../models/api/CustomerModel");
const customerValidation = require(__dirname + "/../modules/CustomerValidation");
const customer = require(__dirname + '/../modules/CustomerHandler');
const helper = require(__dirname + '/../modules/CustomHelper');
const verification = require(__dirname + '/../modules/TokenVerification');
const v = require('node-input-validator');
const jwt = require('jsonwebtoken');

const validation = new customerValidation();	

module.exports = {
    name: "Customer",
    login: function(req, res, next) 
    { 
    	// Set validation rule
    	validator = new v( req.body, {
	        email	:'required|email',
	        password: 'required'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {	        	
			    helper.display(res, validation.message(validator.errors));
	        } else {	

	        	// Set auth data
		    	data = {
		    		email	: req.body.email,
		    		password: helper.enCryptPassword(
		    					req.body.password, 
		    					req.body.email
		    				)
		    	};

				// DB read process 
				customerModel.setDB(req.db);		    	
	        	customerModel.auth(data, function(err, response) {
					if (!err) {
						tokenData = {
							customer_id: response.customer_id,
							name: response.name,
							email: response.email,
							role: 'customer'
						}
						// Set bearer token
						token = jwt.sign(
							{data: tokenData}, 
							process.env.AUTH_SECRET_TOKEN, 
							{ expiresIn: process.env.AUTH_TOKEN_TIME }
						);
						output = {
							'customer': {'schema':response}, 
							'accessToken':'Bearer '+token,
							'expires_in' : process.env.AUTH_TOKEN_TIME
						};
						helper.display(res, output, 200);
					} else {
						if(response == 'Invalid') {
							output = {
								'status': 400,
								'code': 'USR_01',
								'message': "Email or Password is invalid",
								'field': 'password'
							};
						} else if(response == '') {
							output = {
								'status': 400,
								'code': 'USR_05',
								'message': "The email doesn't exist.",
								'field': 'email'
							};
						} else {
							output = {
								'status': 400,
								'code': 'USR_05',
								'message': response,
								'field': 'DB'
							};
						}
						helper.display(res, output);
					}
				});
	        }
	    });
    },
    register: function(req, res, next) 
    { 
    	// Set validation rule
    	validator = new v( req.body, {
	        name	:'required|string',
	        email	:'required|email',
	        password: 'required'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {		    
			    helper.display(res, validation.message(validator.errors));
	        } else {	   

	        	// Setting new customer data
	        	data = {
					name	: req.body.name,
		    		email	: req.body.email,
		    		password: helper.enCryptPassword(
		    					req.body.password, 
		    					req.body.email
		    				)
		    	};

				// DB read and write process 
		    	customerModel.setDB(req.db);	    	
	        	customerModel.insertRow(data, 'customer_id', function(err, record) {	        						
					if (!err) {
						customerModel.getCustomer(record, function(err, response) {
							if(!err) {								
								if(response != "") {
									tokenData = {
										customer_id: response.customer_id,
										name: response.name,
										email: response.email,
										role: 'customer'
									}
									
									// Set bearer token
									token = jwt.sign(
										{data: tokenData}, 
										process.env.AUTH_SECRET_TOKEN, 
										{ expiresIn: process.env.AUTH_TOKEN_TIME }
									);						
									
									output = {
										'customer': {'schema':response}, 
										'accessToken':'Bearer '+token,
										'expires_in' : process.env.AUTH_TOKEN_TIME
									};
									helper.display(res, output, 200);
								} else {
									output = {
										'status': 404,
										'code': 'USR_05',
										'message': "Record doesn't exist",
										'field': 'email'
									};
									helper.display(res, output, 404);
								}
							} else {
								output = {
									'status': 400,
									'code': 'USR_04',
									'message': response,
									'field': 'DB'
								};	
								helper.display(res, output);
							}	
						});
					} else {
						if(record.original !== undefined) {
							if(record.original.code == 'ER_DUP_ENTRY') {
								msg = 'The email already exists.';
								field = 'email';
							} else {
								msg = record.original.sqlMessage;		
								field = 'DB';
							}
						}

						output = {
							'status': 400,
							'code': 'USR_04',
							'message': msg,
							'field': field
						};
						helper.display(res, output);
					}
				});
	        }
	    });
    },
    updateProfile: function(req, res, next) 
    { 
    	// Set validation rule
    	validator = new v( req.body, {
	        name	 :'required',
	        email	 :'required|email',
	        day_phone:'phoneNumber',
	        eve_phone:'phoneNumber',
	        mob_phone:'phoneNumber'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {		    	        	
			    helper.display(res, validation.message(validator.errors));
	        } else {
	        	// Check token
	        	customerDetail = verification.verify(req, res, jwt);
	        	if (typeof customerDetail.data == 'undefined') {
	        		helper.display(res, customerDetail, 401);	        	
	        	} else {
	        		// Set new data
		        	data = {
						name		: req.body.name,
			    		email		: req.body.email,				    		
			    		day_phone	: (req.body.day_phone !== undefined) 
			    						? req.body.day_phone : '',
			    		eve_phone	: (req.body.eve_phone !== undefined) 
			    						? req.body.eve_phone : '',
			    		mob_phone	: (req.body.mob_phone !== undefined) 
			    						? req.body.mob_phone : ''
			    	};

			    	if(req.body.password !== undefined) {
			    		data.password = helper.enCryptPassword(
			    							req.body.password, 
			    							req.body.email
			    						);
			    	}

			    	// Update record
			    	customer.update(
			    		req, 
			    		res, 
			    		customerDetail.data.customer_id, 
			    		data, 
			    		customerModel, 
			    		helper
			    	);
	        	}	        	
	        }
	    });
    },
    updateAddress: function(req, res, next) 
    { 
    	// Set validation rule
    	validator = new v( req.body, {
	        address_1 : 'required',
	        city : 'required',
	        region : 'required',
	        postal_code : 'required',
	        country : 'required',
	        shipping_region_id : 'required|integer'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {	
			    helper.display(res, validation.message(validator.errors));
	        } else {		    	
		    	// Check token
	        	customerDetail = verification.verify(req, res, jwt);
	        	if (typeof customerDetail.data == 'undefined') {
	        		helper.display(res, customerDetail, 401);	        	
	        	} else {
	        		// Set new data
		        	data = {
						address_1			: req.body.address_1,
						address_2			: (req.body.address_2 !== undefined) 
			    								? req.body.address_2 : '',
			    		city				: req.body.city,				    		
			    		region				: req.body.region,
			    		postal_code			: req.body.postal_code,
			    		country				: req.body.country,
			    		shipping_region_id	: req.body.shipping_region_id
			    	};

			    	// Update record
			    	customer.update(
			    		req, 
			    		res, 
			    		customerDetail.data.customer_id,
			    		data, 
			    		customerModel, 
			    		helper
			    	);
	        	}	        	
	        }
	    });
    },
    updateCreditCard: function(req, res, next) 
    { 
    	// Set validation rule
    	validator = new v( req.body, {
	        credit_card : 'required|creditCard'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {	        			    
			    helper.display(res, validation.message(validator.errors));
	        } else {
	        	// Check token
	        	customerDetail = verification.verify(req, res, jwt);	        	
	        	if (typeof customerDetail.data == 'undefined') {
	        		helper.display(res, customerDetail, 401);	        	
	        	} else {
	        		// Set new data
		        	data = { 
		        		credit_card: req.body.credit_card 
		        	};

			    	// Update record
			    	customer.update(
			    		req, 
			    		res, 
			    		customerDetail.data.customer_id, 
			    		data, 
			    		customerModel, 
			    		helper
			    	);
	        	}
	        }
	    });
    }
}