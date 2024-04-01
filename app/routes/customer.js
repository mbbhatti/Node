Customer = require(__dirname + "/../controllers/Customer");

module.exports = function(app) {
    app.post('/login', function(req, res) {
        Customer.login(req, res);
    })
    app.post('/register', function(req, res) {
        Customer.register(req, res);
    })
    app.put('/customer', function(req, res) {
        Customer.updateProfile(req, res);
    })
    app.put('/customer/address', function(req, res) {
        Customer.updateAddress(req, res);
    })
    app.put('/customer/creditCard', function(req, res) {
        Customer.updateCreditCard(req, res);
    });
};
