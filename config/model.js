const path = require('path');
const fs = require('fs');

// Define a method to initialize models
function initializeModels(sequelize) {
    const modelDir = path.join(__dirname, '../', 'app', 'models', 'api');
    fs.readdirSync(modelDir).filter(file => {
        return file.endsWith('.js') && file !== 'index.js';
    }).forEach(file => {
        const model = require(path.join(modelDir, file));
        model.setDB(sequelize);
    });
}

module.exports = { initializeModels };
