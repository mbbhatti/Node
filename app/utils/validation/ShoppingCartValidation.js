/**
 * Shopping cart validation
 */
exports.message = function(data) {
    const generateError = (code, message, field) => ({
        'status': 400,
        'code': code,
        'message': message,
        'field': field
    });

    const validateField = (field, fieldName, requiredErrorCode, typeErrorCode) => {
        if (field?.rule === 'required') {
            return generateError(requiredErrorCode, `The ${fieldName} is required.`, fieldName);
        }
        if (field?.rule === 'integer') {
            return generateError(typeErrorCode, `The ${fieldName} is not a number.`, fieldName);
        }
        return null;
    };

    const errors = [
        validateField(data.cart_id, 'cart ID', 'SC_01', ''),
        validateField(data.product_id, 'product ID', 'PRO_01', 'PRO_02'),
        validateField(data.attributes, 'attributes', 'SC_01', ''),
        validateField(data.stripeToken, 'stripeToken', 'SC_01', ''),
        validateField(data.order_id, 'order ID', 'SC_01', 'SC_02'),
        validateField(data.description, 'description', 'SC_01', ''),
        validateField(data.amount, 'amount', 'SC_01', 'SC_02'),
        validateField(data.item_id, 'item ID', 'SC_01', 'SC_02')
    ].filter(Boolean);

    return errors.length ? errors[0] : true;
}