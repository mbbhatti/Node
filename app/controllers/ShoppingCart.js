const shoppingCartModel = require(__dirname + "/../models/api/ShoppingCartModel");
const shoppingCartValidation = require(__dirname + "/../modules/ShoppingCartValidation");
const helper = require(__dirname + '/../modules/CustomHelper');
const v = require('node-input-validator');

const validation = new shoppingCartValidation();	

module.exports = {
    name: "shopping Cart",
    add: function(req, res, next) 
    { 
    	// Set validation rule
    	let validator = new v( req.body, {
	        cart_id 	:'required|integer',
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

				// DB read and write process 
		    	shoppingCartModel.setDB(req.db);	    	
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
	        }
	    });
    },
    delete: function(req, res, next) 
    { 
    	// Set validation rule
    	let validator = new v( req.params, {
	        cart_id :'required|integer'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {		    
			    helper.display(res, validation.message(validator.errors));
	        } else {	   
	        	
		    	var where  = "cart_id = " + req.params.cart_id;
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
    }
}