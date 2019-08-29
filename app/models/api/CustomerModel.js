const Model = require(__dirname + "/../../models/BaseModel");

const table = 'customer';
model = new Model();
model.table_name = table;

/**
 * User Auth
 *
 * @param {object} req customer info object
 *
 * @return string|object 
 */
model.auth = async function(req) {
    // Get where and bind values
    whereBind = await model.prepareBindWhere({
        email: req.email
    });
    sql = "SELECT *  FROM " + table + whereBind.where;

    // Get data
    result = await model.execute(sql, whereBind.bind);
    if (result.length > 0) {
        data = result[0];
        if (data.password != req.password) {
            return 'Invalid';
        } else {
            delete data.password;
            return data;
        }
    } else {
        return 'NotFound';
    }
}

module.exports = model;