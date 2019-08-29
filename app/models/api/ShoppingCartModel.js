const Model = require(__dirname + "/../../models/BaseModel");

const table = 'shopping_cart';
model = new Model();
model.table_name = table;

/**
 * Get last inserted cart
 *
 * @param {integer} id shopping cart item
 *
 * @return string|object 
 */
model.getLastCart = async function(id) {
    // Get where and bind values
    whereBind = await model.prepareBindWhere({
        item_id: id
    });

    sql = `
        SELECT
          sc.item_id,
          p.name,
          sc.attributes,
          sc.product_id,
          p.image,
          p.price, 
          sc.quantity, 
          p.price AS subtotal
        FROM
           ` + table + ` AS sc
        INNER JOIN
          product AS p
        ON
          p.product_id = sc.product_id ` +
        whereBind.where;

    // Return response
    return await model.execute(sql, whereBind.bind);
}

/**
 * Get cart data by id
 *
 * @param {integer} id shopping cart id
 *
 * @return string|object 
 */
model.getCartById = async function(id) {
    // Get where and bind values
    whereBind = await model.prepareBindWhere({
        cart_id: id
    });

    sql = `
        SELECT
          sc.item_id,
          sc.attributes,
          sc.quantity,
          p.product_id, 
          p.name,
          p.price
        FROM
           ` + table + ` AS sc
        INNER JOIN
          product AS p
        ON
          p.product_id = sc.product_id ` +
        whereBind.where;

    // Return response
    return await model.execute(sql, whereBind.bind);
}

/**
 * Check duplicate cart
 *
 * @param {object} data shopping cart request object
 *
 * @return string|object 
 */
model.checkDuplicate = async function(data) {
    // Get where and bind values
    whereBind = await model.prepareBindWhere(data);

    sql = `
          SELECT 
            item_id as id, 
            quantity 
          FROM ` +
        table +
        whereBind.where;

    // Get data
    result = await model.execute(sql, whereBind.bind);

    // Return response
    return result[0];
}

module.exports = model;