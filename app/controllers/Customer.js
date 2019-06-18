const customerModel = require(__dirname + "/../models/api/CustomerModel");
const customerValidation = require(__dirname + "/../modules/CustomerValidation");
const customer = require(__dirname + '/../modules/CustomerHandler');
const helper = require(__dirname + '/../modules/CustomHelper');
const auth = require(__dirname + '/../../config/auth');
const v = require('node-input-validator');
const jwt = require('jsonwebtoken');

const validation = new customerValidation();	

module.exports = {
    name: "Customer",
    login: function(req, res, next) 
    { 
    	// Set validation rule
    	let validator = new v( req.body, {
	        email	:'required|email',
	        password: 'required'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {	        	
			    helper.display(res, validation.message(validator.errors));
	        } else {	

	        	// Set auth data
		    	var data = {
		    		email	: req.body.email,
		    		password: helper.enCryptPassword(
		    					req.body.password, 
		    					req.body.email
		    				)
		    	};
				
				// Set query condition       				
				var where = 'email = "'+data.email+'" and password = "'+data.password+'"';

				// DB read process 
				customerModel.setDB(req.db);		    	
	        	customerModel.getRow('*', where, function(err, response) {
					if (!err) {
						var tokenData = {
							customer_id: response.customer_id,
							name: response.name,
							email: response.email,
							role: 'customer'
						}
						// Set bearer token
						var token = jwt.sign(
							{data: tokenData}, 
							auth.token.secret, 
							{ expiresIn: auth.token.time }
						);

						output = {
							'customer': {'schema':response}, 
							'accessToken':'Bearer '+token,
							'expires_in' : Math.floor(auth.token.time/3600)+'h'
						};
						helper.display(res, output, 200);
					} else {
						output = {
							'status': 404,
							'code': 'USR_01',
							'message': 'Email or Password is invalid',
							'field': 'DB'
						};						
						helper.display(res, output, 404);
					}
				});
	        }
	    });
    },
    register: function(req, res, next) 
    { 
    	// Set validation rule
    	let validator = new v( req.body, {
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
	        	var data = {
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
									var tokenData = {
										customer_id: response.customer_id,
										name: response.name,
										email: response.email,
										role: 'customer'
									}
									
									// Set bearer token
									var token = jwt.sign(
										{data: tokenData}, 
										auth.token.secret, 
										{ expiresIn: auth.token.time }
									);						
									
									output = {
										'customer': {'schema':response}, 
										'accessToken':'Bearer '+token,
										'expires_in' : Math.floor(auth.token.time/3600)+'h'
									};
									helper.display(res, output, 200);
								} else {
									output = {
										'status': 404,
										'code': 'USR_05',
										'message': "Record doesn't exist",
										'field': 'DB'
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

						var msg = '';
						if(record.original !== undefined) {
							if(record.original.code == 'ER_DUP_ENTRY') {
								msg = 'The email already exists.';
							} else {
								msg = record.original.sqlMessage;		
							}
						}

						output = {
							'status': 400,
							'code': 'USR_04',
							'message': msg,
							'field': 'DB'
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
    	let validator = new v( req.body, {
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
	        	tokenCustomerId = customer.tokenVerify(req, res, jwt, auth);
	        	if (typeof tokenCustomerId != "number") {
	        		helper.display(res, tokenCustomerId, 401);	        	
	        	} else {
	        		// Set new data
		        	var data = {
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
			    		tokenCustomerId, 
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
    	let validator = new v( req.body, {
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
	        	tokenCustomerId = customer.tokenVerify(req, res, jwt, auth);
	        	if (typeof tokenCustomerId != "number") {
	        		helper.display(res, tokenCustomerId, 401);	        	
	        	} else {
	        		// Set new data
		        	var data = {
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
			    		tokenCustomerId, 
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
    	let validator = new v( req.body, {
	        credit_card : 'required|creditCard'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {	        			    
			    helper.display(res, validation.message(validator.errors));
	        } else {
	        	// Check token
	        	tokenCustomerId = customer.tokenVerify(req, res, jwt, auth);
	        	if (typeof tokenCustomerId != "number") {
	        		helper.display(res, tokenCustomerId, 401);	        	
	        	} else {
	        		// Set new data
		        	var data = { 
		        		credit_card: req.body.credit_card 
		        	};

			    	// Update record
			    	customer.update(
			    		req, 
			    		res, 
			    		tokenCustomerId, 
			    		data, 
			    		customerModel, 
			    		helper
			    	);
	        	}
	        }
	    });
    }
}