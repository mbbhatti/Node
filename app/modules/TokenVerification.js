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
verify = function(req, res, jwt) {
    // Get USER-KEY token
    token = req.headers['user-key'];

    if (token == "" || token == undefined) {
        output = {
            'status': 401,
            'code': 'AUT_01',
            'message': 'Authorization code is empty',
            'field': 'USER-KEY'
        };
    } else {
        // Get and verify key
        token = token.split(/\s+/).pop();
        jwt.verify(token, process.env.AUTH_SECRET_TOKEN, function(err, decoded) {
            if (err) {
                output = {
                    'status': 401,
                    'code': 'AUT_02',
                    'message': 'Access Unauthorized',
                    'field': 'USER-KEY'
                };
            } else {
                output = decoded;
            }
        });
    }
    return output;
}

exports.verify = verify;