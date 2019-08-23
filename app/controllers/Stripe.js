const stripeValidation = require(__dirname + "/../modules/StripeValidation");
const helper = require(__dirname + '/../modules/CustomHelper');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const v = require('node-input-validator');

const validation = new stripeValidation();	

module.exports = {
    name: "Stripe",
    charge: function(req, res, next) 
    { 
    	// Set validation rule
    	validator = new v( req.body, {
	        stripeToken :'required',
	        order_id	:'required|integer',
	        description :'required',
	        amount  	:'required|integer'
	    });

    	// Check validation
	    validator.check().then(function (matched) {
	        if (!matched) {		    
			    helper.display(res, validation.message(validator.errors));
	        } else {	   

	        	// Setting charge data
		    	stripe.charges.create({
					amount: req.body.amount, // 100
				  	currency: 'usd',
				  	source: req.body.stripeToken, //tok_visa
				  	metadata: {'order_id': req.body.order_id},
				  	description: req.body.description // text
				}, function(err, charge) {
				  	if(!err) {
						helper.display(res, charge, 200);									
					} else {
						output = {
							'status': 406,
							'code': 'STR_03',
							'message': err.message,
							'field': 'Stripe'
						};						
						helper.display(res, output, 406);
					}	
				});	
	        }
	    });
    }
}