const { Sequelize } = require('sequelize');
const config = require('../config');
const { initializeModels } = require('./model');

const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
    dialect: config.database.connection,
    host: config.database.host,
    port: config.database.port,
    logging: false // Disable logging of SQL queries
});

async function databaseConnection() {
    try {
        await sequelize.authenticate();

        // Initialize models
        initializeModels(sequelize);

        return true;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return false;
    }
}

module.exports = { databaseConnection };