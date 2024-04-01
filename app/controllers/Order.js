const path = require('path');
const shoppingCartModel = require(path.join(__dirname, '..', 'models', 'api', 'ShoppingCartModel'));
const orderDetailModel = require(path.join(__dirname, '..', 'models', 'api', 'OrderDetailModel'));
const orderModel = require(path.join(__dirname, '..', 'models', 'api', 'OrderModel'));
const orderValidation = require(path.join(__dirname, '..', 'utils', 'validation', 'OrderValidation'));
const orderHandler = require(path.join(__dirname, '..', 'utils', 'handler', 'OrderHandler'));
const tokenVerification = require(path.join(__dirname, '..', 'utils', 'TokenVerification'));
const helper = require(path.join(__dirname, '..', 'utils', 'CustomHelper'));
const nodeInputValidation = require('node-input-validator');
const jwt = require('jsonwebtoken');
const df = require('dateformat');

module.exports = {
    async create(req, res) {
        try {
            const validator = new nodeInputValidation(req.body, {
                cart_id: 'required',
                shipping_id: 'required|integer',
                tax_id: 'required|integer'
            });

            const isValid = await validator.check();
            if (!isValid) {
                return helper.display(res, orderValidation.message(validator.errors));
            }

            const customer = tokenVerification.verify(req, res, jwt);
            if (typeof customer.data === 'undefined') {
                return helper.display(res, customer);
            }

            const cartData = await shoppingCartModel.getCartById(req.body.cart_id);
            if (!cartData || cartData.length === 0) {
                return helper.display(res, { 'code': 'OR_03', 'message': 'Cart ID does not exist' });
            }

            let total_amount = 0;
            for (const item of cartData) {
                total_amount += (item.price * item.quantity);
            }

            const dateTime = df(new Date(), 'yyyy-mm-dd HH-MM-ss');
            const order_data = {
                total_amount: total_amount,
                customer_id: customer.data.customer_id,
                shipping_id: req.body.shipping_id,
                tax_id: req.body.tax_id,
                status: 1,
                created_on: dateTime,
                shipped_on: dateTime
            };

            const orderId = await orderModel.insertRow(order_data, 'order_id');
            await orderDetailModel.insertOrderDetail(cartData, orderId);
            const deleteResponse = await shoppingCartModel.deleteRow({ cart_id: req.body.cart_id });

            if (!deleteResponse) {
                helper.display(res, { 'code': 'OR_10', 'message': 'Shopping cart process failed' });
            }

            await orderHandler.sendEmail(res, customer, orderId, helper);
        } catch (error) {
            helper.display(res, { 'code': 'OR_10', 'message': error.message });
        }
    }
};