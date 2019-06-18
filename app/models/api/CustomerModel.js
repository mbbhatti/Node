var Model = require(__dirname + "/../../models/BaseModel");

var table = 'customer';
model = new Model();
model.table_name = table;

/* 
 * Get last inserted customer record
 * Removes password field from result
 *
 * @param data for customer id
 * @param callback function
 *
 * return string|object 
 */
model.getCustomer = function(data, callback) {
    var sql = "SELECT * FROM " + table + " WHERE customer_id = " + data.id;
    this.db.query(sql).then(dbRes => {
        if (dbRes.length > 0) {
            let data = dbRes[0][0]; 
            delete data.password;
            callback(false, data);
        } else {
            callback(false, '');
        }
    }).catch(err => {
        callback(true, err);
    });
}

module.exports = model;