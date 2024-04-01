/**
 * Verify USER-KEY bearer token
 *
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {object} jwt json web token object
 *
 * @return object 
 */
exports.verify = function(req, res, jwt) {
    let output;

    let token = req.headers.authorization; // To Get USER-KEY token as req.headers['user-key'];

    if (!token) {
        output = {'code': 'AUT_01', 'message': 'Authorization code is empty'};
    } else {
        token = token.split(/\s+/).pop();
        jwt.verify(token, process.env.AUTH_SECRET_TOKEN, function(err, decoded) {
            if (err) {
                output = {'code': 'AUT_02', 'message': 'Access Unauthorized'};
            } else {
                output = decoded;
            }
        });
    }

    return output;
};