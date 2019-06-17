ShoppingCart = require(__dirname + "/../controllers/ShoppingCart");

module.exports = function(app, attachSQLDB, next){    
    app.post('/shoppingcart/add', attachSQLDB, function(req, res) {    	
        ShoppingCart.add(req, res, next);
    })
    app.delete('/shoppingcart/empty/:cart_id?', attachSQLDB, function(req, res) {    	
        ShoppingCart.delete(req, res, next);
    });
};
