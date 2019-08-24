const shoppingCartModel = require(__dirname + "/../models/api/ShoppingCartModel");
const orderDetailModel = require(__dirname + "/../models/api/OrderDetailModel");
const orderModel = require(__dirname + "/../models/api/OrderModel");
const orderValidation = require(__dirname + "/../modules/OrderValidation");
const order = require(__dirname + '/../modules/OrderHandler');
const verification = require(__dirname + '/../modules/TokenVerification');
const helper = require(__dirname + '/../modules/CustomHelper');
const v = require('node-input-validator');
const jwt = require('jsonwebtoken');
const df = require('dateformat');

const validation = new orderValidation();	

module.exports = {
    name: "Order",
    create: function(req, res, next) 
    { 
    	// Set validation rule
    	validator = new v( req.body, {
	        cart_id 	:'required',
	        shipping_id	:'required|integer',
	        tax_id  	:'required|integer'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {		    
			    helper.display(res, validation.message(validator.errors));
	        } else {
	        	customer = verification.verify(req, res, jwt);
	        	if (typeof customer.data == 'undefined') {
	        		helper.display(res, customer, 401);	        	
	        	} else {					  		
			  		// DB get shopping cart and product data 
			    	shoppingCartModel.setDB(req.db);	    						    				    	
			    	shoppingCartModel.getCartById(req.body.cart_id, function(err, cartData) {			    		
			    		if(!err && cartData !== undefined && cartData.length > 0) {
			    			
			    			// Caculate total price with quantity
			    			total_amount = 0;
			    			total_entries = -1;
			    			for (i = 0; i < cartData.length; i++) {
			    				total_amount +=(cartData[i].price * cartData[i].quantity);	
			    				total_entries ++; 				    				
			    			}				    			

			    			// Set Date and time
			    			now = new Date();
			    			dateTime = df(now, "yyyy-mm-dd HH-MM-ss");

			    			// Setting order data
				        	order_data = {
								total_amount	: total_amount,
					    		customer_id		: customer.data.customer_id,
					    		shipping_id		: req.body.shipping_id,
					    		tax_id			: req.body.tax_id,
					    		status			: 1,
					    		created_on		: dateTime,
					    		shipped_on		: dateTime
					    	};

					    	// DB add order
					    	orderModel.setDB(req.db);
			    			orderModel.insertRow(order_data, 'order_id', function(err, ordRes) {					
								if (!err) {
									// DB add order detail
									orderDetailModel.setDB(req.db);
									orderDetailModel.insertOrderDetail(cartData, ordRes, function(err, detRes) {
										if (!err) {
											// Set request data
	        								data = {cart_id: req.body.cart_id};

											// DB delete shopping cart entry 
									    	shoppingCartModel.setDB(req.db);	    	
								        	shoppingCartModel.deleteRow(data, function(err, response) {								        			        		
												if (!err) {				
													// send Order confirmation email											
													order.sendEmail(res, customer, ordRes, helper);														
												} else {
													output = {
														'status': 400,
														'code': 'OR_04',
														'message': 'Check Email Configuration',
														'field': ''
													};						
													helper.display(res, output);
												}
											});													
										} else {
											if(detRes.original !== undefined) {
												msg = detRes.original.sqlMessage;		
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
									if(ordRes.original !== undefined) {
										msg = ordRes.original.sqlMessage;		
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
								'field': 'cart_id'
							};						
							helper.display(res, output);
			    		}
			    	});				        	
				}					
			}
	    });
    }
}