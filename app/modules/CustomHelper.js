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
 * @param {string} message information string
 * @param {integer} errCode status response
 *
 * @return object 
 */
display = function(res, message, errCode = 400) {
    res.contentType('application/json');
    res.status(errCode);

    if (errCode == 200) {
        res.write(JSON.stringify(message));
    } else {
        res.write(JSON.stringify({
            'error': message
        }));
    }
    
    res.end();
}

exports.display = display;