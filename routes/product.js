Product = require(__dirname + "/../app/controllers/Product");

module.exports = function(app, next) {    
    app.get('/products', function(req, res) {      	
        Product.all(req, res, next);
    })
    app.get('/products/search', function(req, res) {      	
        Product.search(req, res, next);
    })
    app.get('/products/:product_id?/details', function(req, res) { 
        Product.detail(req, res, next);
    })
    app.get('/products/inCategory/:category_id?', function(req, res) { 
        Product.category(req, res, next);
    })
    app.get('/products/inDepartment/:department_id?', function(req, res) { 
        Product.department(req, res, next);
    });
};
