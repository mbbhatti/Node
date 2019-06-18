Customer = require(__dirname + "/../app/controllers/Customer");

module.exports = function(app, attachSQLDB, next){    
    app.post('/customers/login', attachSQLDB, function(req, res) {    	
        Customer.login(req, res, next);
    })
    app.post('/customers', attachSQLDB, function(req, res) {    	
        Customer.register(req, res, next);
    })
    app.put('/customers', attachSQLDB, function(req, res) {
        Customer.updateProfile(req, res, next);
    })
    app.put('/customers/address', attachSQLDB, function(req, res) {
        Customer.updateAddress(req, res, next);
    })
    app.put('/customers/creditCard', attachSQLDB, function(req, res) {
        Customer.updateCreditCard(req, res, next);
    });
};
