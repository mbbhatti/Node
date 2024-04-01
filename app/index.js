const app = require('./app');
const config = require('../config');
const path = require('path');
const swaggerDocs = require(path.join(__dirname, '..', 'config', 'swagger'));

const PORT = process.env.PORT || config.port || 5000;
const URL = process.env.URL || 'localhost';

swaggerDocs(app);

app.listen(PORT, function() {
    console.log(`Server is listening on ${URL}:${PORT}`);
});