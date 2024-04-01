const crypto = require('crypto');

/**
 * Created encrypted password
 *
 * @param {string} pwd 
 * @param {string} salt
 *
 * @return string 
 */
exports.enCryptPassword = function(pwd, salt) {
    hash = crypto.createHash('sha256').update(pwd).update(salt).digest('base64');

    return (hash);
};

/**
 * Manage response
 *
 * @param {object} res express response object
 * @param {string} msg information object
 * @param {number} code status response
 *
 * @return object 
 */
exports.display = function(res, msg, code = 400) {
    let message;

    if (!msg) {
        message = errorResponse(400, 'Bad Request: No message provided');
    } else {
        if (code !== 200) {
            if (msg.status === undefined) {
                message = errorResponse(msg.code, msg.message);
                code = message.status;
            } else {
                message = msg;
                code = msg.status;
            }
        } else {
            message = msg;
        }
    }

    // Set response
    res.contentType('application/json');
    res.status(code);

    // Write response
    const response = (code === 200) ? message : { error: message };
    res.json(response);
};

/**
 * Manage errors
 *
 * @param {string} code status key
 * @param {string} message to display
 *
 * @return object 
 */
function errorResponse(code, message) {
    const errorCodes = {
        'AUT_01': {'status': 401, 'code': code, 'message': message, 'field': 'NoAuth'},
        'AUT_02': {'status': 401, 'code': code, 'message': message, 'field': 'NoAuth'},
        'USR_01': {'status': 400, 'code': code, 'message': message, 'field': 'password'},
        'USR_04': {'status': 302, 'code': code, 'message': message, 'field': 'email'},
        'USR_05': {'status': 404, 'code': code, 'message': message, 'field': 'email'},
        'USR_10': {'status': 422, 'code': code, 'message': message, 'field': 'DB'},
        'OR_03': {'status': 404, 'code': code, 'message': message, 'field': 'cart_id'},
        'OR_10': {'status': 422, 'code': code, 'message': message, 'field': 'DB'},
        'SC_03': {'status': 404, 'code': code, 'message': message, 'field': 'item_id'},
        'SC_04': {'status': 404, 'code': code, 'message': message, 'field': 'cart_id'},
        'SC_05': {'status': 422, 'code': code, 'message': message, 'field': 'DB'},
        'PRO_10': {'status': 422, 'code': code, 'message': message, 'field': 'DB'},
        'STR_03': {'status': 406, 'code': code, 'message': message, 'field': 'stripe'},
        'E_01': {'status': 422, 'code': code, 'message': message, 'field': 'email_send'}
    }

    if (errorCodes[code]) {
        errorCodes[code].message = message;
        errorCodes[code].code = code;

        return errorCodes[code];
    } else {
        return { 'status': 500, 'field': 'Unknown', 'message': 'Unknown error occurred' };
    }
}