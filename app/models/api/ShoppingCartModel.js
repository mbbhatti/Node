const Model = require(__dirname + "/../../models/BaseModel");

const table = 'shopping_cart';
model = new Model();
model.table_name = table;

/**
 * Get last inserted cart
 *
 * @param {object} data shopping cart request object
 * @param {function} callback response object
 *
 * @return object 
 */
model.getLastCart = function(data, callback) {
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
          p.product_id = sc.product_id
        WHERE
          sc.item_id = $id `;

    this.db.query(sql, 
      { 
        bind: { id: data.id },
        type: this.db.QueryTypes.SELECT 
      }
    ).then(dbRes => {
        callback(false, dbRes);
    }).catch(err => {
        callback(true, err);
    });
}

/**
 * Get cart data by id
 *
 * @param {integer} cid shopping cart id
 * @param {function} callback response object
 *
 * @return object 
 */
model.getCartById = function(cid, callback) {
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
          p.product_id = sc.product_id
        WHERE
          sc.cart_id = $cid `;

    this.db.query(sql, 
      { 
        bind: { cid: cid },
        type: this.db.QueryTypes.SELECT 
      }
    ).then(dbRes => {
        callback(false, dbRes);
    }).catch(err => {
        callback(false, err);
    });
}

/**
 * Check duplicate cart
 *
 * @param {object} data shopping cart request object
 * @param {function} callback response object
 *
 * @return object 
 */
model.checkDuplicate = function(data, callback) {
    sql = `
          SELECT 
            item_id as id, 
            quantity 
          FROM 
            ` + table  + `
          WHERE 
            cart_id = $cid AND 
            product_id = $pid AND 
            attributes = $attributes `;
    
    this.db.query(sql, 
      { 
        bind: { 
          cid: data.cart_id,
          pid: data.product_id,
          attributes: data.attributes 
        },
        type: this.db.QueryTypes.SELECT 
      }
    ).then(dbRes => {
        callback(false, dbRes[0]);
    }).catch(err => {
        callback(false, err);
    });
}

module.exports = model;