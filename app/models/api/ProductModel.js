const Model = require(__dirname + "/../../models/BaseModel");

const table = 'product';
model = new Model();
model.table_name = table;

/**
 * Get product by id
 *
 * @param {object} data for product
 *
 * @return string|object  
 */
model.getById = async function(data) {
    // Get where and bind values
    whereBind = await model.prepareBindWhere(data);

    sql = `
        SELECT
          product_id, 
          name, 
          description, 
          price, 
          discounted_price, 
          image, 
          image_2
        FROM ` +
        table +
        whereBind.where;

    // Get data
    return await model.execute(sql, whereBind.bind);
};

/**
 * Get all products
 *
 * @param {integer} page request number
 * @param {integer} limit request record limit
 * @param {integer} desLen request description length
 * @param {string} qs request search string
 *
 * @return string|object 
 */
model.getProducts = async function(page, limit, desLen, qs) {
    // Set search key condition
    where = '';

    if (qs != '') {
        where = " WHERE MATCH(name, description) AGAINST ('" + qs + "' IN NATURAL LANGUAGE MODE)";
    }

    // Get record count
    sql = "SELECT count(product_id) as total FROM " + table + where;

    const result = await model.execute(sql);

    // Get record detail
    if (result.length > 0) {
        output = {};

        // Set total records
        output.count = result[0].total;

        // Set attribute and description length
        attribute = "product_id, name, ";
        if (desLen > 0) {
            attribute += "CONCAT(LEFT(description, " + desLen + "), '...') AS description, ";
        } else {
            attribute += "description, ";
        }
        attribute += "price, discounted_price, thumbnail";

        // Set pagination
        start = (page - 1) * limit;

        // Get records
        sql = "SELECT " + attribute +
            " FROM " + table +
            where +
            " LIMIT " + start + "," + limit;

        output.rows = await model.execute(sql);

        return output;
    } else {
        return result;
    }
};

/**
 * Get categoty or department based products
 *
 * @param {integer} page request number
 * @param {integer} limit request record limit
 * @param {integer} desLen request description length
 * @param {integer} cid category id
 * @param {integer} did department id
 *
 * @return string|object 
 */

model.getByCatProId = async function(page, limit, desLen, cid, did) {
    // Set joins condition
    condition = " INNER JOIN product_category AS pc ON pc.product_id = p.product_id";
    condition += " INNER JOIN category AS c ON c.category_id = pc.category_id";

    // Condition by category/product id
    if (cid > 0) {
        condition += " WHERE c.category_id = " + cid;
    } else if (did > 0) {
        condition += " WHERE c.department_id = " + did + " AND p.display > 0";
    }

    // Get record count
    sql = "SELECT count(p.product_id) as total FROM " +
        table + " AS p " +
        condition;

    const result = await model.execute(sql);

    // Get record detail   
    if (result.length > 0) {

        output = {};

        // Set total records
        output.count = result[0].total;

        // Set attribute and description length
        attribute = "p.product_id, p.name, ";
        if (desLen > 0) {
            attribute += "CONCAT(LEFT(p.description, " + desLen + "), '...') AS description, ";
        } else {
            attribute += "p.description, ";
        }
        attribute += "p.price, p.discounted_price, p.thumbnail";

        // Set result order
        order = (cid) ? " ORDER BY p.name ASC" : " ORDER BY p.display DESC";

        // Set pagination
        start = (page - 1) * limit;

        // Get records
        sql = "SELECT " + attribute +
            " FROM " + table + " AS p " +
            condition +
            order +
            " LIMIT " + start + ", " + limit;

        output.rows = await model.execute(sql);

        return output;
    } else {
        return result;
    }
};

module.exports = model;