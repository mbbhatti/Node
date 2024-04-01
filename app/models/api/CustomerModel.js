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
    // Prepare WHERE clause and bind values
    const whereBind = await model.prepareBindWhere({ email: req.email });
    const sql = `SELECT * FROM ${table} ${whereBind.where}`;

    // Execute SQL query
    const result = await model.execute(sql, whereBind.bind);

    // Check if user exists
    if (result.length > 0) {
        const userData = result[0];
        // Check if passwords match
        if (userData.password !== req.password) {
            return false; // Passwords don't match
        } else {
            delete userData.password; // Remove password from returned data

            return userData; // Return user data
        }
    } else {
        return null; // User not found
    }
}

module.exports = model;