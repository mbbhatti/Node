/**
 * Order validation 
 */
class OrderValidation {
    message(data) {
        if (data.cart_id !== undefined &&
            data.cart_id.rule === 'required') {
            return {
                'status': 400,
                'code': 'OR_01',
                'message': 'The cart ID is required.',
                'field': 'cart_id'
            }
        } else if (data.shipping_id !== undefined) {
            if (data.shipping_id.rule === 'required') {
                return {
                    'status': 400,
                    'code': 'OR_01',
                    'message': 'The shipping ID is required.',
                    'field': 'shipping_id'
                }
            } else if (data.shipping_id.rule === 'integer') {
                return {
                    'status': 400,
                    'code': 'OR_02',
                    'message': 'The shipping ID is not number.',
                    'field': 'shipping_id'
                }
            }
        } else if (data.tax_id !== undefined) {
            if (data.tax_id.rule === 'required') {
                return {
                    'status': 400,
                    'code': 'OR_01',
                    'message': 'The tax ID is required.',
                    'field': 'tax_id'
                }
            } else if (data.tax_id.rule === 'integer') {
                return {
                    'status': 400,
                    'code': 'OR_02',
                    'message': 'The tax ID is not number.',
                    'field': 'tax_id'
                }
            }
        }

        return true;
    }
}

module.exports = OrderValidation;