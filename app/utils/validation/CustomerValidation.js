/**
 * Customer validation 
 */
exports.message = function(data) {
    const generateError = (code, message, field) => ({
        'status': 400,
        'code': code,
        'message': message,
        'field': field
    });

    const validateField = (field, fieldName) => {
        if (field?.rule === 'required') {
            return generateError('USR_02', `The ${fieldName} is required.`, fieldName);
        }
        if (field?.rule === 'email') {
            return generateError('USR_03', `The ${fieldName} is invalid.`, fieldName);
        }
        if (field?.rule === 'creditCard') {
            return generateError('USR_08', `This is an invalid ${fieldName}.`, fieldName);
        }
        if (field?.rule === 'phoneNumber') {
            return generateError('USR_06', `This is an invalid ${fieldName}.`, fieldName);
        }
        if (field?.rule === 'integer') {
            return generateError('USR_09', `The ${fieldName} is not a number.`, fieldName);
        }
        return null;
    };

    const errors = [
        validateField(data.email, 'email'),
        validateField(data.password, 'password'),
        validateField(data.name, 'name'),
        validateField(data.address_1, 'address 1'),
        validateField(data.city, 'city'),
        validateField(data.region, 'region'),
        validateField(data.postal_code, 'postal code'),
        validateField(data.country, 'country'),
        validateField(data.shipping_region_id, 'shipping region ID'),
        validateField(data.credit_card, 'credit card'),
        validateField(data.day_phone, 'day phone'),
        validateField(data.eve_phone, 'evening phone'),
        validateField(data.mob_phone, 'mobile phone')
    ].filter(Boolean);

    return errors.length ? errors[0] : true;
}