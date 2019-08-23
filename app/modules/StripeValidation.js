/**
* Stripe validation 
*/
class StripeValidation 
{
    message(data) 
    {
        if (data.stripeToken !== undefined && 
            data.stripeToken.rule === "required") {
            return {
                'status': 400,
                'code': 'STR_01',
                'message': 'The stripeToken is required.',
                'field': 'stripeToken'
            }
        } else if (data.order_id !== undefined) {
            if (data.order_id.rule === "required") {
                return {
                    'status': 400,
                    'code': 'STR_01',
                    'message': 'The order ID is required.',
                    'field': 'order_id'
                }
            } else if (data.order_id.rule === "integer") {
                return {
                    'status': 400,
                    'code': 'STR_02',
                    'message': 'The order ID is not number.',
                    'field': 'order_id'
                }
            }
        } else if (data.description !== undefined && 
            data.description.rule === "required") {
            return {
                'status': 400,
                'code': 'STR_01',
                'message': 'The description is required.',
                'field': 'description'
            }
        } else if (data.amount !== undefined) {
            if (data.amount.rule === "required") {
                return {
                    'status': 400,
                    'code': 'STR_01',
                    'message': 'The amount is required.',
                    'field': 'amount'
                }
            } else if (data.amount.rule === "integer") {
                return {
                    'status': 400,
                    'code': 'STR_02',
                    'message': 'The amount is not number.',
                    'field': 'amount'
                }
            }
        }

        return true;
    }
}

module.exports = StripeValidation;