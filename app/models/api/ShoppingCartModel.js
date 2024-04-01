const Model = require(__dirname + "/../../models/BaseModel");

const table = 'shopping_cart';
model = new Model();
model.table_name = table;

/**
 * Get last inserted cart
 *
 * @param {integer} itemId shopping cart item
 *
 * @return string|object
 */
model.getLastCart = async function (itemId) {
    try {
        const whereBind = await model.prepareBindWhere({item_id: itemId});
        const sql = `
            SELECT
                sc.item_id AS cart_item_id,
                p.name AS product_name,
                sc.attributes AS cart_attributes,
                sc.product_id AS product_id,
                p.image AS product_image,
                p.price AS product_price,
                sc.quantity AS cart_quantity,
                p.price * sc.quantity AS subtotal
            FROM
                ${table} AS sc
            INNER JOIN
                product AS p
            ON
                p.product_id = sc.product_id
            ${whereBind.where}`;

        return await model.execute(sql, whereBind.bind);
    } catch (error) {
        throw error;
    }
}

/**
 * Get cart data by id
 *
 * @param {integer} id shopping cart id
 *
 * @return string|object 
 */
model.getCartById = async function(id) {
    try {
        const whereBind = await model.prepareBindWhere({ cart_id: id });
        const sql = `
            SELECT
                sc.item_id,
                sc.attributes,
                sc.quantity,
                p.product_id, 
                p.name,
                p.price
            FROM
                ${table} AS sc
            INNER JOIN
                product AS p
            ON
                p.product_id = sc.product_id
            ${whereBind.where}`;

        return await model.execute(sql, whereBind.bind);
    } catch (error) {
        throw error;
    }
}

/**
 * Check duplicate cart
 *
 * @param {object} data shopping cart request object
 *
 * @return string|object 
 */
model.checkDuplicate = async function(data) {
    try {
        const condition = await model.prepareBindWhere(data);
        const sql = `SELECT item_id as id, quantity FROM ${table} ${condition.where}`;
        const result = await model.execute(sql, condition.bind);

        return result[0];
    } catch (error) {
        throw error;
    }
}

module.exports = model;