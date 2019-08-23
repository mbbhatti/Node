const Model = require(__dirname + "/../../models/BaseModel");

const table = 'product';
model = new Model();
model.table_name = table;

/* 
 * Get product by id
 *
 * @param pid       use for product id
 * @param callback  use as function
 *
 * return object 
 */
model.getById = function(pid, callback) {

    sql = `
        SELECT
          product_id, 
          name, 
          description, 
          price, 
          discounted_price, 
          image, 
          image_2
        FROM
           ` + table + `
        WHERE
          product_id = $pid `;

    this.db.query(sql, 
      { 
        bind: { 
            pid: pid
        },
        type: this.db.QueryTypes.SELECT 
    }).then(dbRes => {
        callback(false, dbRes);
    }).catch(function(err) {
        callback(true, err);
    });
};

/* 
 * Get all products
 *
 * @param page      it represents page number
 * @param limit     it indicates limit per page
 * @param desLen    it used for description length
 * @param qs        use for query string
 * @param callback  use as function
 *
 * return object 
 */
model.getProducts = function(page, limit, desLen, qs, callback) {

    // Set search key condition
    where = '';
    if (qs != '') {
        where = " WHERE MATCH(name, description) AGAINST ('" + qs + "' IN NATURAL LANGUAGE MODE)";
    }

    sql = "SELECT count(product_id) as total FROM " + table + where;

    this.db.query(sql, { type: this.db.QueryTypes.SELECT }).then(results => {
        if (results.length > 0) {

            output = {};

            // Set total records
            output.count = results[0].total;

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
            sql = "SELECT " + attribute 
                + " FROM " + table 
                + where 
                + " LIMIT " + start + "," + limit;
                
            this.db.query(sql, { type: this.db.QueryTypes.SELECT }).then(dbRes => {                
                output.rows = dbRes;
                callback(false, output);
            }).catch(err => {
                callback(true, err);
            });
        } else {
            callback(true, results);
        }
    }).catch(function(err) {
        callback(true, err);
    });
};

/* 
 * Get all products
 *
 * @param page      it represents page number
 * @param limit     it indicates limit per page
 * @param desLen    it used for description length
 * @param cid       use for category id
 * @param did       use for department id
 * @param callback  use as function
 *
 * return object 
 */

model.getByCatProId = function(page, limit, desLen, cid, did, callback) {

    // Set joins condition
    condition = " INNER JOIN product_category AS pc ON pc.product_id = p.product_id";
    condition += " INNER JOIN category AS c ON c.category_id = pc.category_id";

    // Condition by category/product id
    if (cid > 0) {
        condition += " WHERE c.category_id = " + cid;
    } else if (did > 0) {
        condition += " WHERE c.department_id = " + did + " AND p.display > 0";
    }

    // Count query
    sql = "SELECT count(p.product_id) as total FROM " 
            + table + " AS p " 
            + condition;

    this.db.query(sql, { type: this.db.QueryTypes.SELECT }).then(results => {
        if (results.length > 0) {

            output = {};

            // Set total records
            output.count = results[0].total;

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
            sql = "SELECT " + attribute 
                + " FROM " + table + " AS p " 
                + condition 
                + order 
                + " LIMIT " + start + ", " + limit;

            this.db.query(sql, { type: this.db.QueryTypes.SELECT }).then(dbRes => {
                output.rows = dbRes;
                callback(false, output);
            }).catch(err => {
                callback(true, err);
            });
        } else {
            callback(true, results);
        }
    }).catch(function(err) {
        callback(true, err);
    });
};

module.exports = model;