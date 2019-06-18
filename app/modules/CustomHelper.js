const crypto = require('crypto');

/* 
 * Created encrypted password
 *
 * @param pwd 
 * @param salt
 *
 * return string 
 */
var enCryptPassword = function(pwd, salt) {
    var hash = crypto.createHash('sha256').update(pwd).update(salt).digest('base64');
    return (hash);
};

exports.enCryptPassword = enCryptPassword;

/* 
 * Manage response
 *
 * @param res 
 * @param message 
 * @param errCode
 *
 * return object 
 */
var display = function(res, message, errCode = 400) {
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