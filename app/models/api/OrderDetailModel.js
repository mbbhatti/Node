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
    const fields = ['item_id', 'order_id', 'product_id', 'attributes', 'product_name', 'quantity', 'unit_cost'];
    let values = [];

    data.forEach(item => {
        const temp = [
            `"${item.item_id}"`,
            `"${orderId}"`,
            `"${item.product_id}"`,
            `"${item.attributes}"`,
            `"${item.name}"`,
            `"${item.quantity}"`,
            `"${item.price}"`
        ];
        values.push(`(${temp.join(', ')})`);
    });

    const sql = `INSERT INTO ${table} (${fields.join(', ')}) VALUES ${values.join(', ')}`;

    try {
        const results = await this.db.query(sql);

        return results.length > 0 ? results[0] : results;
    } catch (err) {
        throw err.original.sqlMessage;
    }
};

module.exports = model;