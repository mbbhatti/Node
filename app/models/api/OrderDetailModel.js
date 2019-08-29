const Model = require(__dirname + "/../../models/BaseModel");

const table = 'order_detail';
model = new Model();
model.table_name = table;

/**
 * Bulk insert order detail
 *
 * @param {object} data object
 * @param {integer} orderId represent order id
 *
 * @return string|object  
 */
model.insertOrderDetail = async function(data, orderId) {	
	fields = 'item_id, order_id, product_id, attributes, product_name, quantity, unit_cost';
	values = '';

	for (i = 0; i < data.length; i++) {
		temp = '("'+
					data[i].item_id+
					'", "'+orderId+
					'","'+data[i].product_id+
					'","'+data[i].attributes+
					'","'+data[i].name+
					'","'+data[i].quantity+
					'","'+data[i].price+
				'")';

		values = values.concat(temp + ',');
	}
	
	//-- Remove the last character
    values = values.substr(0, values.length - 1);

    sql = "INSERT INTO " + table + " (" + fields + ") VALUES " + values;	
    return await this.db.query(sql).then(results => {
        if (results.length > 0) {
        	return results[0];
        } else {
            return results;
        }
    }).catch(function(err) {
        throw (err.original.sqlMessage);
    });
};

module.exports = model;