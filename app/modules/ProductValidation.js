/**
 * Product validation
 */
class ProductValidation {
    message(data) {
        if (data.query_string !== undefined &&
            data.query_string.rule === 'required') {
            return {
                'status': 400,
                'code': 'PRO_01',
                'message': 'The query string is required.',
                'field': 'query_string'
            }
        } else if (data.category_id !== undefined) {
            if (data.category_id.rule === 'required') {
                return {
                    'status': 400,
                    'code': 'CAT_02',
                    'message': 'The category ID is required.',
                    'field': 'category_id'
                }
            } else if (data.category_id.rule === 'integer') {
                return {
                    'status': 400,
                    'code': 'CAT_03',
                    'message': 'The category ID is not number.',
                    'field': 'category_id'
                }
            }
        } else if (data.department_id !== undefined) {
            if (data.department_id.rule === 'required') {
                return {
                    'status': 400,
                    'code': 'DEP_01',
                    'message': 'The department ID is required.',
                    'field': 'department_id'
                }
            } else if (data.department_id.rule === 'integer') {
                return {
                    'status': 400,
                    'code': 'DEP_03',
                    'message': 'The department ID is not number.',
                    'field': 'department_id'
                }
            }
        } else if (data.product_id !== undefined) {
            if (data.product_id.rule === 'required') {
                return {
                    'status': 400,
                    'code': 'PRO_01',
                    'message': 'The product ID is required.',
                    'field': 'product_id'
                }
            } else if (data.product_id.rule === 'integer') {
                return {
                    'status': 400,
                    'code': 'PRO_02',
                    'message': 'The product ID is not number.',
                    'field': 'product_id'
                }
            }
        } else if (data.page !== undefined) {
            if (data.page.rule === 'integer') {
                return {
                    'status': 400,
                    'code': 'PRO_02',
                    'message': 'The page is not number.',
                    'field': 'page'
                }
            }
        } else if (data.limit !== undefined) {
            if (data.limit.rule === 'integer') {
                return {
                    'status': 400,
                    'code': 'PRO_02',
                    'message': 'The limit is not number.',
                    'field': 'limit'
                }
            }
        } else if (data.description_length !== undefined) {
            if (data.description_length.rule === 'integer') {
                return {
                    'status': 400,
                    'code': 'PRO_02',
                    'message': 'The description length is not number.',
                    'field': 'description_length'
                }
            }
        }

        return true;
    }
}

module.exports = ProductValidation;