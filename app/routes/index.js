const customerRoutes = require('./customer');
const orderRoutes = require('./order');
const productRoutes = require('./product');
const shoppingCartRoutes = require('./shoppingCart');
const stripeRoutes = require('./stripe');

const defaultRouteHandler = function(req, res) {
    res.status(404).send('Route not found');
};

module.exports = function(app) {
    const routes = [
        customerRoutes,
        orderRoutes,
        productRoutes,
        shoppingCartRoutes,
        stripeRoutes
    ];

    routes.forEach(route => {
        route(app);
    });
};
