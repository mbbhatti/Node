Stripe = require(__dirname + "/../controllers/Stripe");

module.exports = function(app, next) {    
    app.post('/stripe/charge', function(req, res) {    	
        Stripe.charge(req, res, next);
    });
};
