const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const dotenv = require('dotenv').config();
const fs = require('fs');
const path = require('path');

module.exports = {
	name: "Backend",
	run: function() {
        app = express();                
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        
        port = Number(process.env.APP_PORT || 5000);
        app.listen(port, function() {
            console.log('Listening on ', process.env.APP_URL +':'+ process.env.APP_PORT);
        }); 

        // Set DB connection
		this.connection();

        // Set app routes
        this.routes(app);        
	},
    connection: function() {
        next = function(req, res) {
            console.log('next(req, res)');
        }

        sqldb = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
            dialect: "mysql",
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            logging: false // Hide query at console
        });

        db = function(req, res, next)
        {            
            sqldb.authenticate().then(() => {                                
                next();                  
            }).catch(err => {
                msg = 'Unable to connect to the database, check .env file for database configuration';                               

                res.contentType('application/json');   
                res.status(500);             
                res.write(JSON.stringify({'error': msg}));
                res.end();              
            });
        };

        // Assign database object to the models
        this.models(sqldb);
    },
    models: function(sqldb) {
        const basename = path.basename(__filename);
        const modelDir = "./app/models/api/";

        fs.readdirSync(modelDir).filter(file => {            
            return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
        })
        .forEach(file => {
            fileName = file.split('.').slice(0, -1).join('.');            
            fileName = require(modelDir + fileName);
            fileName.setDB(sqldb);
        });
    },
    routes: function(app) { 
        next = function(req, res) {
            console.log('next(req, res)');
        }

        // Define routes
        customerRoute = require('./routes/customer')(app, next);
        productRoute = require('./routes/product')(app, next);
        shoppingCartRoute = require('./routes/shoppingCart')(app, next);
        stripeRoute = require('./routes/stripe')(app, next);
        orderRoute = require('./routes/order')(app, next);
    }    
};

module.exports.run();