/**
 * Product validation
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
        validateField(data.query_string, 'query string', 'PRO_01', '',),
        validateField(data.category_id, 'category ID', 'CAT_02', 'CAT_03'),
        validateField(data.department_id, 'department ID', 'DEP_01', 'DEP_03'),
        validateField(data.product_id, 'product ID', 'PRO_01', 'PRO_02'),
        validateField(data.page, 'page', '','PRO_02'),
        validateField(data.limit, 'limit', '','PRO_02'),
        validateField(data.description_length, 'description length', '','PRO_02')
    ].filter(Boolean);

    return errors.length ? errors[0] : true;
}
