/* 
 * Verify USER-KEY bearer token
 *
 * @param req
 * @param res 
 * @param jwt       used for json web token
 * @param callback  function
 *
 * return object 
 */
var tokenVerify = function(req, res, jwt, auth) {
    // Get USER-KEY token
    token = req.headers['user-key'];

    if (token == "" || token == undefined) {
        output = {
            'status': 204,
            'code': 'AUT_01',
            'message': 'Authorization code is empty',
            'field': 'USER-KEY'
        };
    } else {
        // Get and verify key
        token = token.split(/\s+/).pop();
        jwt.verify(token, auth.token.secret, function(err, decoded) {
            if (err) {
                output = {
                    'status': 401,
                    'code': 'AUT_02',
                    'message': 'Access Unauthorized',
                    'field': 'USER-KEY'
                };
            } else {
                output = decoded.data.customer_id;
            }
        });
    }
    return output;
}

exports.tokenVerify = tokenVerify;

/* 
 * Update customer record
 *
 * @param req
 * @param res 
 * @param cid           Indicates customer id
 * @param data          Modified customer data 
 * @param customerModel customer model object
 * @param cstHelper     use for response message
 * @param callback      function
 *
 * return object
 */
var update = function(req, res, cid, data, customerModel, cstHelper) {
    // Set query condition
    where = " customer_id ='" + cid + "'";

    // DB update process 
    customerModel.setDB(req.db);
    customerModel.updateRow(data, where, function(error, response) {
        if (!error) {
            cstHelper.display(res, response, 200);
        } else {
            output = {
                'status': 404,
                'code': 'USR_05',
                'message': "Record doesn't exist",
                'field': 'DB'
            };
            cstHelper.display(res, output, 404);
        }
    });
}

exports.update = update;