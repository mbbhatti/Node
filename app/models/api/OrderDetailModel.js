var Model = require(__dirname + "/../../models/BaseModel");

var table = 'order_detail';
model = new Model();
model.table_name = table;

/* 
 * Bulk insert order detail
 *
 * @param data 
 * @param order
 * @param callback function
 *
 * return string|object 
 */
model.insertOrderDetail = function(data, order, callback) {
	
	var fields = 'item_id, order_id, product_id, attributes, product_name, quantity, unit_cost';
	var values = '';

	for (let i = 0; i < data.length; i++) {
		let temp = '("'+
					data[i].item_id+
					'", "'+order.id+
					'","'+data[i].product_id+
					'","'+data[i].attributes+
					'","'+data[i].name+
					'","'+data[i].quantity+
					'","'+data[i].price+
					'")';

		values = values.concat(temp + ',');
	}
	//-- Remove the last character which is comma
    values = values.substr(0, values.length - 1);

    let sql = "INSERT INTO " + table + " (" + fields + ") VALUES " + values;
	
    this.db.query(sql).then(results => {
        if (results.length > 0) {
            callback(false, results[0]);
        } else {
            callback(true, results);
        }
    }).catch(function(err) {
        callback(true, err);
    });
};

module.exports = model;