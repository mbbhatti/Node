Product = require(__dirname + "/../controllers/Product");

module.exports = function(app, next) {
    app.get('/products', function(req, res) {
        Product.all(req, res);
    })
    app.get('/products/search', function(req, res) {
        Product.search(req, res);
    })
    app.get('/products/:product_id?/details', function(req, res) {
        Product.detail(req, res);
    })
    app.get('/products/inCategory/:category_id?', function(req, res) {
        Product.category(req, res);
    })
    app.get('/products/inDepartment/:department_id?', function(req, res) {
        Product.department(req, res);
    });
};
