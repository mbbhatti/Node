const shoppingCartModel = require(__dirname + "/../models/api/ShoppingCartModel");
const shoppingCartValidation = require(__dirname + "/../modules/ShoppingCartValidation");
const helper = require(__dirname + '/../modules/CustomHelper');
const v = require('node-input-validator');
var randomToken = require('random-token');

const validation = new shoppingCartValidation();	

module.exports = {
    name: "shopping Cart",
    add: function(req, res, next) 
    { 
    	// Set validation rule
    	let validator = new v( req.body, {
	        cart_id 	:'required',
	        product_id	:'required|integer',
	        attributes  :'required'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {		    
			    helper.display(res, validation.message(validator.errors));
	        } else {	   

	        	// Setting new customer data
	        	var data = {
					cart_id		: req.body.cart_id,
		    		product_id	: req.body.product_id,
		    		attributes	: req.body.attributes
		    	};

		    	// Update record on this condition
		    	var where = 'cart_id = "' + data.cart_id 
                + '" and product_id = "' + data.product_id 
                + '" and attributes = "' + data. attributes + '"';

				// DB read and write process 
		    	shoppingCartModel.setDB(req.db);	
		    	shoppingCartModel.checkDuplicate(where, function(err, check) {		    		
		    		if (!err) {
		    			if(check.quantity == undefined) {
		    				shoppingCartModel.insertRow(data, 'item_id', function(err, record) {
								if (!err) {
									shoppingCartModel.getLastCart(record, function(err, response) {
										if(!err) {
											if(response.length > 0) {
												helper.display(res, response, 200);	
											} else {
												output = {
													'status': 404,
													'code': 'SC_03',
													'message': "Record doesn't exist",
													'field': 'DB'
												};
												helper.display(res, output, 404);
											}								
										} else {
											output = {
												'status': 406,
												'code': 'SC_04',
												'message': err,
												'field': 'DB'
											};						
											helper.display(res, output, 406);
										}	
									});						
								} else {
									var msg = '';
									if(record.original !== undefined) {
										msg = record.original.sqlMessage;		
									}

									output = {
										'status': 400,
										'code': 'SC_04',
										'message': msg,
										'field': 'DB'
									};						
									helper.display(res, output);
								}
							});
		    			} else {
		    				var update = {quantity: check.quantity + 1};
		    				shoppingCartModel.updateRow(update, where, function(error, response) {
						        if (!error) {
						            shoppingCartModel.getLastCart(check, function(err, response) {
										if(!err) {
											if(response.length > 0) {
												helper.display(res, response, 200);	
											} else {
												output = {
													'status': 404,
													'code': 'SC_03',
													'message': "Record doesn't exist",
													'field': 'DB'
												};
												helper.display(res, output, 404);
											}								
										} else {
											output = {
												'status': 406,
												'code': 'SC_04',
												'message': err,
												'field': 'DB'
											};						
											helper.display(res, output, 406);
										}	
									});
						        } else {
						            output = {
						                'status': 404,
						                'code': 'USR_05',
						                'message': "Record doesn't exist",
						                'field': 'DB'
						            };
						            helper.display(res, output, 404);
						        }
						    });
		    			}
		    		} else {
		    			var msg = '';
						if(record.original !== undefined) {
							msg = record.original.sqlMessage;		
						}

						output = {
							'status': 400,
							'code': 'SC_04',
							'message': msg,
							'field': 'DB'
						};						
						helper.display(res, output);
		    		}
		    	});
	        }
	    });
    },
    empty: function(req, res, next) 
    { 
    	// Set validation rule
    	let validator = new v( req.params, {
	        cart_id :'required'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {		    
			    helper.display(res, validation.message(validator.errors));
	        } else {	   
	        	
		    	var where  = "cart_id = '" + req.params.cart_id + "'";
				// DB delete process 
		    	shoppingCartModel.setDB(req.db);	    	
	        	shoppingCartModel.deleteRow(where, function(err, response) {	        		
					if (!err) {				
						output = {
							'status': 200,
							'code': 'SC_04',
							'message': "shopping cart clear",
							'field': 'cart_id'
						};		
						helper.display(res, output, 200);														
					} else {
						output = {
							'status': 404,
							'code': 'SC_03',
							'message': "Don't exist cart with this ID",
							'field': 'cart_id'
						};						
						helper.display(res, output, 404);
					}
				});
	        }
	    });
    },
    generateUniqueId: function(req, res, next) 
    {     	
    	output = {
			'cart_id': randomToken(11)
		};		

		helper.display(res, output, 200);
    },
    removeProduct: function(req, res, next) 
    { 
    	// Set validation rule
    	let validator = new v( req.params, {
	        item_id :'required|integer'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {		    
			    helper.display(res, validation.message(validator.errors));
	        } else {	   
	        	
		    	var where  = "item_id = " + req.params.item_id;
				// DB delete process 
		    	shoppingCartModel.setDB(req.db);	    	
	        	shoppingCartModel.deleteRow(where, function(err, response) {
					if (!err) {				
						output = {
							'status': 200,
							'code': 'SC_04',
							'message': "Item cart removed",
							'field': 'item_id'
						};		
						helper.display(res, output, 200);														
					} else {
						output = {
							'status': 404,
							'code': 'SC_03',
							'message': "Don't exist item with this ID",
							'field': 'item_id'
						};						
						helper.display(res, output, 404);
					}
				});
	        }
	    });
    }
}