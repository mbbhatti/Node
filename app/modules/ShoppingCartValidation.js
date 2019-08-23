/**
* Shopping cart validation
*/
class ShoppingCartValidation 
{
    message(data) 
    {
        if (data.cart_id !== undefined && 
            data.cart_id.rule === "required") {
            return {
                'status': 400,
                'code': 'SC_01',
                'message': 'The cart ID is required.',
                'field': 'cart_id'
            }
            
        } else if (data.product_id !== undefined) {
            if (data.product_id.rule === "required") {
                return {
                    'status': 400,
                    'code': 'PRO_01',
                    'message': 'The product ID is required.',
                    'field': 'product_id'
                }
            } else if (data.product_id.rule === "integer") {
                return {
                    'status': 400,
                    'code': 'PRO_02',
                    'message': 'The product ID is not number.',
                    'field': 'product_id'
                }
            }
        } else if (data.attributes !== undefined && 
            data.attributes.rule === "required") {
            return {
                'status': 400,
                'code': 'SC_01',
                'message': 'The attributes is required.',
                'field': 'attributes'
            }
        } else if (data.stripeToken !== undefined 
            && data.stripeToken.rule === "required") {
            return {
                'status': 400,
                'code': 'SC_01',
                'message': 'The stripeToken is required.',
                'field': 'stripeToken'
            }
        } else if (data.order_id !== undefined) {
            if (data.order_id.rule === "required") {
                return {
                    'status': 400,
                    'code': 'SC_01',
                    'message': 'The order ID is required.',
                    'field': 'order_id'
                }
            } else if (data.order_id.rule === "integer") {
                return {
                    'status': 400,
                    'code': 'SC_02',
                    'message': 'The order ID is not number.',
                    'field': 'order_id'
                }
            }
        } else if (data.description !== undefined && 
            data.description.rule === "required") {
            return {
                'status': 400,
                'code': 'SC_01',
                'message': 'The description is required.',
                'field': 'description'
            }
        } else if (data.amount !== undefined) {
            if (data.amount.rule === "required") {
                return {
                    'status': 400,
                    'code': 'SC_01',
                    'message': 'The amount is required.',
                    'field': 'amount'
                }
            } else if (data.amount.rule === "integer") {
                return {
                    'status': 400,
                    'code': 'SC_02',
                    'message': 'The amount is not number.',
                    'field': 'amount'
                }
            }
        } else if (data.item_id !== undefined) {
            if (data.item_id.rule === "required") {
                return {
                    'status': 400,
                    'code': 'SC_01',
                    'message': 'The item ID is required.',
                    'field': 'item_id'
                }
            } else if (data.item_id.rule === "integer") {
                return {
                    'status': 400,
                    'code': 'SC_02',
                    'message': 'The item ID is not number.',
                    'field': 'item_id'
                }
            }
        }

        return true;
    }
}

module.exports = ShoppingCartValidation;