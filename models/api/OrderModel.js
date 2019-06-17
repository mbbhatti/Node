var Model = require(__dirname + "/../../models/BaseModel");

var table = 'orders';
model = new Model();
model.table_name = table;

module.exports = model;