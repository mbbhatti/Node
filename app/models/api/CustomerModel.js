const Model = require(__dirname + "/../../models/BaseModel");

const table = 'customer';
model = new Model();
model.table_name = table;

/**
 * User Auth
 *
 * @param data      use for customer info
 * @param callback  use as function
 *
 * @return string|object 
 */
model.auth = function(req, callback) {

    sql = ` 
        SELECT 
            * 
        FROM 
        ` + table + `
        WHERE 
            email = $email `;
    
    this.db.query(sql, 
        { 
            bind: { 
                email: req.email
            }, 
            type: this.db.QueryTypes.SELECT 
        }).then(dbRes => {
        if (dbRes.length > 0) {
            data = dbRes[0]; 
            if(data.password != req.password) {
                callback(true, 'Invalid');    
            } else {
                delete data.password;
                callback(false, data);    
            }            
        } else {
            callback(true, '');
        }
    }).catch(err => {
        callback(true, err);
    });
}

/**
 * Get last inserted customer record
 * Removes password field from result
 *
 * @param data for customer id
 * @param callback function
 *
 * @return string|object 
 */
model.getCustomer = function(data, callback) {
    sql = ` 
        SELECT 
            * 
        FROM 
        ` + table + `
        WHERE 
            customer_id = $id `;
    
    this.db.query(sql, 
        { 
            bind: { 
                id: data.id
            },
            type: this.db.QueryTypes.SELECT 
        }).then(dbRes => {
        if (dbRes.length > 0) {
            data = dbRes[0]; 
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