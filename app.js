const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const dotenv = require('dotenv').config();

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

		this.routes(app);
	},
    routes: function(app) { 
        next = function(req, res) {
            console.log('next(req, res)');
        }

        sqldb = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
            dialect: "mysql",
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            logging: false // Use to hide sql at console
        });

        attachSQLDB = function(req, res, next)
        {            
            sqldb.authenticate().then(() => {                
                req.db = sqldb;            
                next();                  
            }).catch(err => {
                msg = 'Unable to connect to the database, check .env file for database configuration';
                console.log(msg);                

                res.contentType('application/json');   
                res.status(500);             
                res.write(JSON.stringify({'error': msg}));
                res.end();              
            });
        };  

        customerRoute = require('./routes/customer')(app, attachSQLDB, next);
        productRoute = require('./routes/product')(app, attachSQLDB, next);
        shoppingCartRoute = require('./routes/shoppingCart')(app, attachSQLDB, next);
        stripeRoute = require('./routes/stripe')(app, attachSQLDB, next);
        orderRoute = require('./routes/order')(app, attachSQLDB, next);

    }
};

module.exports.run();