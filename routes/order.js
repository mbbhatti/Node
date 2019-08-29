Order = require(__dirname + "/../app/controllers/Order");

module.exports = function(app, next) {    
    app.post('/orders', function(req, res) {    	
        Order.create(req, res, next);
    });
};
