var express = require('express');
var bodyParser = require('body-parser');

module.exports = {
	name: "Backend",
	run: function() {

        app = express();        
        app.set('dbtype', 'mysql');
        
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        app.use(express.static(__dirname + '/public'));
        
        var port = Number(process.env.PORT || 5000);
        app.listen(port, function() {
            console.log('Listening on http://localhost:' + port);
        }); 

		this.routes(app);
	},
    routes: function(app) { 
        var next = function(req, res) {
            console.log('next(req, res)');
        }                

        var config = require('./config/setting')(); 

        if (app.get('dbtype') == 'mysql') {     
            var Sequelize = require('sequelize');
            
            var sqldb = new Sequelize(config.mysql.db, config.mysql.user, config.mysql.password, {
                dialect: "mysql",
                host: config.mysql.host,
                port: config.mysql.port
            });
        }

        var attachSQLDB = function(req, res, next)
        {            
            sqldb.authenticate().then(() => {
                console.log('Connection established successfully.');
                req.db = sqldb;            
                next();                  
            }).catch(err => {
                msg = 'Unable to connect to the database';
                console.log(msg);                

                res.contentType('application/json');   
                res.status(500);             
                res.write(JSON.stringify({'error': msg}));
                res.end();              
            });
        };  

        var customerRoute = require('./routes/customer')(app, attachSQLDB, next);
        var productRoute = require('./routes/product')(app, attachSQLDB, next);
        var shoppingCartRoute = require('./routes/shoppingCart')(app, attachSQLDB, next);
        var stripeRoute = require('./routes/stripe')(app, attachSQLDB, next);
        var orderRoute = require('./routes/order')(app, attachSQLDB, next);

    }
};

module.exports.run();