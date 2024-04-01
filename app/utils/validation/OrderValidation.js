/**
 * Order validation 
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
            return generateError('OR_01', `The ${fieldName} is required.`, fieldName);
        }
        if (field?.rule === 'integer') {
            return generateError('OR_02', `The ${fieldName} is not a number.`, fieldName);
        }
        return null;
    };

    const errors = [
        validateField(data.cart_id, 'cart ID'),
        validateField(data.shipping_id, 'shipping ID'),
        validateField(data.tax_id, 'tax ID'),
    ].filter(Boolean);

    return errors.length ? errors[0] : true;
}