const Model = require(__dirname + "/../../models/BaseModel");

const table = 'orders';
model = new Model();
model.table_name = table;

module.exports = model;