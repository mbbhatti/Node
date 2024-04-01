const dotenv = require('dotenv');
dotenv.config();

const environment = process.env.ENV || 'development';

const config = {
    development: {
        port: process.env.PORT || 3000,
        database: {
            connection: process.env.DB_CONNECTION || 'mysql',
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'development_db'
        },
        logging: {
            level: process.env.LOGGING_LEVEL || 'debug'
        }
    }
};

module.exports = config[environment];
