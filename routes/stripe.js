Stripe = require(__dirname + "/../app/controllers/Stripe");

module.exports = function(app, attachSQLDB, next){    
    app.post('/stripe/charge', attachSQLDB, function(req, res) {    	
        Stripe.charge(req, res, next);
    });
};
