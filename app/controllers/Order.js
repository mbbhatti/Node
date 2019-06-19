const shoppingCartModel = require(__dirname + "/../models/api/ShoppingCartModel");
const orderModel = require(__dirname + "/../models/api/OrderModel");
const orderValidation = require(__dirname + "/../modules/OrderValidation");
const order = require(__dirname + '/../modules/OrderHandler');
const helper = require(__dirname + '/../modules/CustomHelper');
const auth = require(__dirname + '/../../config/auth');
const v = require('node-input-validator');
const jwt = require('jsonwebtoken');
const df = require('dateformat');

const validation = new orderValidation();	

module.exports = {
    name: "Order",
    create: function(req, res, next) 
    { 
    	// Set validation rule
    	let validator = new v( req.body, {
	        cart_id 	:'required|integer',
	        shipping_id	:'required|integer',
	        tax_id  	:'required|integer'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {		    
			    helper.display(res, validation.message(validator.errors));
	        } else {	   	        	
	        	// Get and check USER-KEY token
				token = req.headers['user-key'];

				if(token == "" || token == undefined) {
					output = {
						'status': 401,
						'code': 'AUT_01',
						'message': 'Authorization code is empty',
						'field': 'USER-KEY'
					};	
					helper.display(res, output, 401);
				} else {		
					token = token.split(/\s+/).pop();
					jwt.verify(token, auth.token.secret, function(err, decoded) {
					  	if (err) {		  			  	
						  	output = {
								'status': 401,
								'code': 'AUT_02',
								'message': 'Access Unauthorized',
								'field': 'USER-KEY'
							};
							helper.display(res, output, 401);
					  	} else {					  		
					  		// DB read product id and price 
					    	shoppingCartModel.setDB(req.db);	    						    				    	
					    	shoppingCartModel.getCartById(req.body.cart_id, function(err, cartData) {					    				
					    		if(!err && cartData !== undefined) {
					    			// Set Date and time
					    			var now = new Date();
					    			dateTime = df(now, "yyyy-mm-dd HH-MM-ss");

					    			// Setting new customer data
						        	var data = {
										total_amount	: cartData.price,
							    		customer_id		: decoded.data.customer_id,
							    		shipping_id		: req.body.shipping_id,
							    		tax_id			: req.body.tax_id,
							    		created_on		: dateTime,
							    		shipped_on		: dateTime
							    	};

							    	// DB write record
							    	orderModel.setDB(req.db);
					    			orderModel.insertRow(data, 'order_id', function(err, record) {					
										if (!err) {											
									  		// send Order confirmation email											
											order.sendEmail(res, decoded, record, helper);
										} else {
											var msg = '';
											if(record.original !== undefined) {
												msg = record.original.sqlMessage;		
											}

											output = {
												'status': 400,
												'code': 'OR_04',
												'message': msg,
												'field': 'DB'
											};						
											helper.display(res, output);
										}
									});
					    		} else {
					    			output = {
										'status': 400,
										'code': 'OR_03',
										'message': "Cart ID doesn't exist",
										'field': 'DB'
									};						
									helper.display(res, output);
					    		}
					    	});				        	
					  	}
					});
				}
	        }
	    });
    }
}