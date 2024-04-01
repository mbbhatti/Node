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
    try {
        const whereBind = await model.prepareBindWhere(data);
        const sql = `
            SELECT
              product_id, 
              name, 
              description, 
              price, 
              discounted_price, 
              image, 
              image_2
            FROM ${table}
            ${whereBind.where}`;

        return await model.execute(sql, whereBind.bind);
    } catch (error) {
        throw error;
    }
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
    let where = '';

    if (qs !== '') {
        where = " WHERE MATCH(name, description) AGAINST ('" + qs + "' IN NATURAL LANGUAGE MODE)";
    }

    // Get record count
    const countQuery = "SELECT count(product_id) as total FROM " + table + where;
    const countResult = await model.execute(countQuery);
    const totalRecords = countResult.length > 0 ? countResult[0].total : 0;

    // Set attribute and description length
    const descriptionAttribute = desLen > 0 ? `CONCAT(LEFT(description, ${desLen}), '...') AS description` : "description";
    const attribute = "product_id, name, " + descriptionAttribute + ", price, discounted_price, thumbnail";

    // Set pagination
    const start = (page - 1) * limit;

    // Get records
    const selectQuery = "SELECT " + attribute + " FROM " + table + where + ` LIMIT ${start}, ${limit}`;
    const rows = await model.execute(selectQuery);

    return {
        count: totalRecords,
        rows: rows
    };
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
    let condition = " INNER JOIN product_category AS pc ON pc.product_id = p.product_id";
    condition += " INNER JOIN category AS c ON c.category_id = pc.category_id";

    if (cid > 0) {
        condition += " WHERE c.category_id = " + cid;
    } else if (did > 0) {
        condition += " WHERE c.department_id = " + did + " AND p.display > 0";
    }

    // Get record count
    const countSql = `SELECT COUNT(p.product_id) as total FROM ${table} AS p ${condition}`;
    const countResult = await model.execute(countSql);

    if (countResult.length === 0) {
        return countResult;
    }

    const totalCount = countResult[0].total;

    // Set attribute and description length
    const descriptionAttribute = desLen > 0 ? `CONCAT(LEFT(p.description, ${desLen}), '...') AS description` : "p.description";
    const attribute = "p.product_id, p.name, " + descriptionAttribute + ", p.price, p.discounted_price, p.thumbnail";

    // Set result order
    const order = (cid) ? " ORDER BY name ASC" : " ORDER BY display DESC";

    // Set pagination
    const start = (page - 1) * limit;

    // Get records
    const selectSql = `SELECT ${attribute} FROM ${table} AS p ${condition}${order} LIMIT ${start}, ${limit}`;
    const rows = await model.execute(selectSql);

    return { count: totalCount, rows };
};

module.exports = model;