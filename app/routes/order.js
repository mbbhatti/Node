Order = require(__dirname + "/../controllers/Order");

module.exports = function(app, next) {    
    app.post('/order', function(req, res) {
        Order.create(req, res, next);
    });
};
