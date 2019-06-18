Order = require(__dirname + "/../app/controllers/Order");

module.exports = function(app, attachSQLDB, next){    
    app.post('/orders', attachSQLDB, function(req, res) {    	
        Order.create(req, res, next);
    });
};
