const shoppingCartModel = require(__dirname + "/../models/api/ShoppingCartModel");
const shoppingCartValidation = require(__dirname + "/../modules/ShoppingCartValidation");
const helper = require(__dirname + '/../modules/CustomHelper');
const v = require('node-input-validator');
const randomToken = require('random-token');

const validation = new shoppingCartValidation();	

module.exports = {
    name: "shopping Cart",
    add: function(req, res, next) 
    { 
    	// Set validation rule
    	validator = new v( req.body, {
	        cart_id 	:'required',
	        product_id	:'required|integer',
	        attributes  :'required'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {		    
			    helper.display(res, validation.message(validator.errors));
	        } else {	        	
	        	// Insert/Update record based on this data
	        	data = {
					cart_id		: req.body.cart_id,
		    		product_id	: req.body.product_id,
		    		attributes	: req.body.attributes
		    	};

				// DB read and write process 
				// Check record and update/insert	    	
		    	shoppingCartModel.checkDuplicate(data)
		    	.then((check) => {		    		
		    		if(check == undefined) {
		    			// Insert cart item
		    			shoppingCartModel.insertRow(data, 'item_id')
		    			.then((record) => {
		    				// Get cart detail
		    				shoppingCartModel.getLastCart(record)
		    				.then((response) => {
		    					if(response.length > 0) {
										helper.display(res, response, 200);	
								} else {
									helper.display(res, {
										'code': 'SC_03',
										'message': "Record doesn't exist"
									});
								}
		    				}).catch((err) => {			
								helper.display(res, {
									'code': 'SC_05',
									'message': err
								});
		    				});									
	    				}).catch((err) => {
							if(err.original !== undefined) {
								msg = err.original.sqlMessage;		
							}

							helper.display(res, {
								'code': 'SC_05',
								'message': msg
							});
	    				});
		    		} else {		    			
		    			update = {quantity: check.quantity + 1};

		    			// Update cart quantity
		    			shoppingCartModel.updateRow(update, data)
		    			.then((record) => {		    				
		    				// Get cart detail
		    				shoppingCartModel.getLastCart(record.item_id)
		    				.then((response) => {
		    					if(response.length > 0) {
									helper.display(res, response, 200);	
								} else {
									helper.display(res, {
										'code': 'SC_03',
										'message': "Record doesn't exist"
									});
								}
		    				}).catch((err) => {
		    					helper.display(res, {
									'code': 'SC_05',
									'message': err
								});
		    				});
		    			}).catch((err) => {
		    				helper.display(res, {
								'code': 'SC_05',
								'message': err
							});
		    			});
		    		}
		    	}).catch((err) => {
		    		helper.display(res, {
						'code': 'SC_05',
						'message': err
					});
		    	});
	        }
	    });
    },
    empty: function(req, res, next) 
    { 
    	// Set validation rule
    	validator = new v( req.params, {
	        cart_id :'required'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {		    
			    helper.display(res, validation.message(validator.errors));
	        } else {
	        	// Set request data
	        	data = {cart_id: req.params.cart_id};
				
				// DB delete process 	    	
	        	shoppingCartModel.deleteRow(data)
	        	.then((response) => {
	        		if(response == 'NotFound') {	        									
						helper.display(res, {
							'code': 'SC_04',
							'message': "Don't exist cart with this ID"
						});
					} else {
		        		output = {
							'status': 200,
							'code': 'SC_04',
							'message': "shopping cart clear",
							'field': 'cart_id'
						};		
						helper.display(res, output, 200);	        		
					}
				}).catch((err) => {
					helper.display(res, {
						'code': 'SC_05',
						'message': err
					});					
				});
	        }
	    });
    },
    generateUniqueId: function(req, res, next) 
    {     	
    	// Generate random token string
    	output = {'cart_id': randomToken(11)};	

    	// Return response	
		helper.display(res, output, 200);
    },
    removeProduct: function(req, res, next) 
    { 
    	// Set validation rule
    	validator = new v( req.params, {
	        item_id :'required|integer'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {		    
			    helper.display(res, validation.message(validator.errors));
	        } else {
	        	// Set request data
	        	data = {item_id: req.params.item_id};

				// DB delete process 	    	
	        	shoppingCartModel.deleteRow(data)
	        	.then((response) => {
	        		if(response == 'NotFound') {	
						helper.display(res, {
							'code': 'SC_03',
							'message': "Don't exist item with this ID"
						});
					} else {
		        		output = {
							'status': 200,
							'code': 'SC_06',
							'message': "Item cart removed",
							'field': 'item_id'
						};		
						helper.display(res, output, 200);	        		
					}
				}).catch((err) => {
					helper.display(res, {
						'code': 'SC_05',
						'message': err
					});					
				});
	        }
	    });
    }
}