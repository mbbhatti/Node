/**
 * Verify USER-KEY bearer token
 *
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {object} jwt json web token object
 *
 * @return object 
 */
verify = function(req, res, jwt) {
    // Get USER-KEY token
    token = req.headers['user-key'];

    if (token == "" || token == undefined) {
        output = {
            'code': 'AUT_01',
            'message': 'Authorization code is empty'
        };
    } else {
        // Get and verify key
        token = token.split(/\s+/).pop();
        jwt.verify(token, process.env.AUTH_SECRET_TOKEN, function(err, decoded) {
            if (err) {
                output = {
                    'code': 'AUT_02',
                    'message': 'Access Unauthorized'
                };
            } else {
                output = decoded;
            }
        });
    }
    return output;
}

exports.verify = verify;