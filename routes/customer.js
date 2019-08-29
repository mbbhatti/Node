Customer = require(__dirname + "/../app/controllers/Customer");

module.exports = function(app, next) {    
    app.post('/customers/login', function(req, res) {    	
        Customer.login(req, res, next);
    })
    app.post('/customers', function(req, res) {    	
        Customer.register(req, res, next);
    })
    app.put('/customers', function(req, res) {
        Customer.updateProfile(req, res, next);
    })
    app.put('/customers/address', function(req, res) {
        Customer.updateAddress(req, res, next);
    })
    app.put('/customers/creditCard', function(req, res) {
        Customer.updateCreditCard(req, res, next);
    });
};
