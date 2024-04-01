/**
 * Stripe validation 
 */
exports.message = function(data) {
    const generateError = (code, message, field) => ({
        status: 400,
        code,
        message,
        field
    });

    const validateField = (field, fieldName) => {
        if (field?.rule === 'required') {
            return generateError('STR_01', `The ${fieldName} is required.`, fieldName);
        }
        if (field?.rule === 'integer') {
            return generateError('STR_02', `The ${fieldName} is not a number.`, fieldName);
        }

        return null;
    };

    const errors = [
        validateField(data.stripeToken, 'stripeToken'),
        validateField(data.order_id, 'order ID'),
        validateField(data.description, 'description'),
        validateField(data.amount, 'amount')
    ].filter(Boolean);

    return errors.length ? errors[0] : true;
}