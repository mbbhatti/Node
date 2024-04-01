const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Model',
            version: '1.0.0',
        },
        servers: [
            {
                url: "http://localhost:5000/",
                description: "Local server"
            },
            // Add more servers if needed
        ]
    },
    apis: ['./doc/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = function swaggerDocs(app) {
    // Swagger Page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    // Documentation in JSON format
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    app.get('/api/users', (req, res) => {
        res.json({ message: 'List of users' });
    });
}