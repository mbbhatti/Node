const path = require("path");
const stripeValidation = require(path.join(__dirname, '..', 'utils', 'validation', 'StripeValidation'));
const helper = require(path.join(__dirname, '..', 'utils', 'CustomHelper'));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodeInputValidation = require('node-input-validator');

module.exports = {
    async charge(req, res) {
        try {
            // Validation
            const validationRules = {
                stripeToken: 'required',
                order_id: 'required|integer',
                description: 'required',
                amount: 'required|integer'
            };

            const validator = new nodeInputValidation(req.body, validationRules);
            const isValid = await validator.check();
            if (!isValid) {
                return helper.display(res, stripeValidation.message(validator.errors));
            }

            // Sanitize input parameters
            const amount = parseInt(req.body.amount);
            const orderId = parseInt(req.body.order_id);

            // Create Stripe charge
            const charge = await stripe.charges.create({
                amount: amount,
                currency: 'usd',
                source: req.body.stripeToken,
                metadata: {'order_id': orderId},
                description: req.body.description
            });

            helper.display(res, charge, 200);
        } catch (error) {
            if (error.type === 'StripeInvalidRequestError') {
                helper.display(res, {'code': 'STR_03', 'message': error.message});
            } else {
                helper.display(res, {'code': 'INTERNAL_ERROR', 'message': 'An internal error occurred'});
            }
        }
    }
}