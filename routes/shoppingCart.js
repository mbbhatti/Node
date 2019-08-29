ShoppingCart = require(__dirname + "/../app/controllers/ShoppingCart");

module.exports = function(app, next) {    
    app.post('/shoppingcart/add', function(req, res) {    	
        ShoppingCart.add(req, res, next);
    })
    app.delete('/shoppingcart/empty/:cart_id?', function(req, res) {    	
        ShoppingCart.empty(req, res, next);
    })
    app.get('/shoppingcart/generateUniqueId', function(req, res) {    	
        ShoppingCart.generateUniqueId(req, res, next);
    })
    app.delete('/shoppingcart/removeProduct/:item_id?', function(req, res) {    	
        ShoppingCart.removeProduct(req, res, next);
    });
};
