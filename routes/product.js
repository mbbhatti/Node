Product = require(__dirname + "/../controllers/Product");

module.exports = function(app, attachSQLDB, next){    
    app.get('/products', attachSQLDB, function(req, res) {      	
        Product.all(req, res, next);
    })
    app.get('/products/search', attachSQLDB, function(req, res) {      	
        Product.search(req, res, next);
    })
    app.get('/products/:product_id?/details', attachSQLDB, function(req, res) { 
        Product.detail(req, res, next);
    })
    app.get('/products/inCategory/:category_id?', attachSQLDB, function(req, res) { 
        Product.category(req, res, next);
    })
    app.get('/products/inDepartment/:department_id?', attachSQLDB, function(req, res) { 
        Product.department(req, res, next);
    });
};
