const crypto = require('crypto');

/**
 * Created encrypted password
 *
 * @param {string} pwd 
 * @param {string} salt
 *
 * @return string 
 */
enCryptPassword = function(pwd, salt) {
    hash = crypto.createHash('sha256').update(pwd).update(salt).digest('base64');
    return (hash);
};

exports.enCryptPassword = enCryptPassword;

/**
 * Manage response
 *
 * @param {object} res express response object
 * @param {string} msg information object
 * @param {integer} code status response
 *
 * @return object 
 */
display = function(res, msg, code = 400) {
    // If code is not 200         
    if(code != 200) { 
        // If msg without status key       
        if(msg.status == undefined) {
            message = errorResponse(msg.code, msg.message);
            code = message.status;                
        } else { // if msg with status key 
            message = msg;
            code = msg.status;
        }        
    } else { // if code is 200
        message = msg;
    }

    // Set response
    res.contentType('application/json');
    res.status(code);
    
    if (code == 200) {
        res.write(JSON.stringify(message));
    } else {
        res.write(JSON.stringify({
            'error': message
        }));
    }
    
    // Send response
    res.end();
}

exports.display = display;

/**
 * Manage errors
 *
 * @param {string} code status key
 * @param {string} message to display
 *
 * @return object 
 */
errorResponse = function(code, message) {
    // message list
    response = {
        'AUT_01': {'status':401, 'code':code, 'message': message, 'field':'NoAuth'},
        'AUT_02': {'status':401, 'code':code, 'message': message, 'field':'NoAuth'},        
        'USR_01': {'status':400, 'code':code, 'message':message,  'field':'password'},
        'USR_04': {'status':302, 'code':code, 'message':message,  'field':'email'},
        'USR_05': {'status':404, 'code':code, 'message':message,  'field':'email'},
        'USR_10': {'status':422, 'code':code, 'message':message,  'field':'DB'},
        'OR_03': {'status':404, 'code':code, 'message':message,  'field':'cart_id'},
        'OR_10': {'status':422, 'code':code, 'message':message,  'field':'DB'},
        'SC_03': {'status':404, 'code':code, 'message':message,  'field':'item_id'},
        'SC_04': {'status':404, 'code':code, 'message':message,  'field':'cart_id'},
        'SC_05': {'status':422, 'code':code, 'message':message,  'field':'DB'},
        'PRO_10': {'status':422, 'code':code, 'message':message,  'field':'DB'},
        'STR_03': {'status':406, 'code':code, 'message':message,  'field':'stripe'},
        'E_01': {'status':422, 'code':code, 'message':message,  'field':'email_send'}
    }

    // Return message object by key
    return response[code];
}

exports.errorResponse = errorResponse;