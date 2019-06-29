const shoppingCartModel = require(__dirname + "/../models/api/ShoppingCartModel");
const orderModel = require(__dirname + "/../models/api/OrderModel");
const orderDetailModel = require(__dirname + "/../models/api/OrderDetailModel");
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
	        cart_id 	:'required',
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
					  		// DB get shopping cart and product data 
					    	shoppingCartModel.setDB(req.db);	    						    				    	
					    	shoppingCartModel.getCartById(req.body.cart_id, function(err, cartData) {					    				
					    		if(!err && cartData !== undefined && cartData.length > 0) {

					    			// Caculate total price with quantity
					    			let total_amount = 0;
					    			let total_entries = -1;
					    			for (let i = 0; i < cartData.length; i++) {
					    				total_amount +=(cartData[i].price * cartData[i].quantity);	
					    				total_entries ++; 				    				
					    			}				    			

					    			// Set Date and time
					    			var now = new Date();
					    			dateTime = df(now, "yyyy-mm-dd HH-MM-ss");

					    			// Setting order data
						        	var order_data = {
										total_amount	: total_amount,
							    		customer_id		: decoded.data.customer_id,
							    		shipping_id		: req.body.shipping_id,
							    		tax_id			: req.body.tax_id,
							    		status			: 1,
							    		created_on		: dateTime,
							    		shipped_on		: dateTime
							    	};

							    	// DB add order
							    	orderModel.setDB(req.db);
					    			orderModel.insertRow(order_data, 'order_id', function(err, ord_res) {					
										if (!err) {
											orderDetailModel.setDB(req.db);
											orderDetailModel.insertOrderDetail(cartData, ord_res, function(err, det_res) {
												if (!err) {

													let where  = "cart_id = '" + req.body.cart_id + "'";
													
													// DB delete shopping cart entry 
											    	shoppingCartModel.setDB(req.db);	    	
										        	shoppingCartModel.deleteRow(where, function(err, response) {	        		
														if (!err) {				
															// send Order confirmation email											
															order.sendEmail(res, decoded, ord_res, helper);														
														}
													});													
												} else {
													var msg = '';
													if(det_res.original !== undefined) {
														msg = det_res.original.sqlMessage;		
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
											var msg = '';
											if(ord_res.original !== undefined) {
												msg = ord_res.original.sqlMessage;		
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