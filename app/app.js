const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { databaseConnection } = require('../config/database');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
databaseConnection().then(connected => {
    if (connected) {
        routes(app);
    } else {
        console.error('Failed to establish database connection');
        process.exit(1);
    }
}).catch(err => {
    console.error('Error connecting to database:', err);
    process.exit(1);
});

module.exports = app;