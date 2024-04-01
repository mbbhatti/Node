const path = require("path");
const shoppingCartModel = require(path.join(__dirname, '..', 'models', 'api', 'ShoppingCartModel'));
const shoppingCartValidation = require(path.join(__dirname, '..', 'utils', 'validation', 'ShoppingCartValidation'));
const helper = require(path.join(__dirname, '..', 'utils', 'CustomHelper'));
const nodeInputValidation = require('node-input-validator');
const randomToken = require('random-token');

module.exports = {
    generateUniqueId: function(req, res) {
        helper.display(res, {'cart_id': randomToken(11)}, 200);
    },
    add: async function(req, res) {
        try {
            const validator = new nodeInputValidation(req.body, {
                cart_id: 'required',
                product_id: 'required|integer',
                attributes: 'required'
            });

            const isValid = await validator.check();
            if (!isValid) {
                return helper.display(res, shoppingCartValidation.message(validator.errors));
            }

            // Set data
            const data = {
                cart_id: req.body.cart_id,
                product_id: req.body.product_id,
                attributes: req.body.attributes
            };

            // Check record already exist
            let record;

            const existingRecord = await shoppingCartModel.checkDuplicate(data);
            if (!existingRecord) {
                record = await shoppingCartModel.insertRow(data);
            } else {
                record = await shoppingCartModel.updateRow(
                    { quantity: existingRecord.quantity + 1 },
                    { item_id: existingRecord.id },
                    true
                );
            }

            const response = await shoppingCartModel.getLastCart(existingRecord?.id ?? record);
            if (response.length > 0) {
                helper.display(res, response, 200);
            } else {
                helper.display(res, { 'code': 'SC_03', 'message': 'Record does not exist' });
            }
        } catch (error) {
            helper.display(res, {'code': 'SC_05', 'message': error.message});
        }
    },
    empty: async function(req, res) {
        // Set validation rule
        const { cart_id } = req.params;
        const validator = new nodeInputValidation({ cart_id }, {
            cart_id: 'required'
        });

        try {
            const matched = await validator.check();
            if (!matched) {
                helper.display(res, shoppingCartValidation.message(validator.errors));
                return;
            }

            // DB delete process
            const response = await shoppingCartModel.deleteRow({ cart_id });

            if (response === null) {
                helper.display(res, {'code': 'SC_04', 'message': 'Do not exist cart with this ID'});
            } else {
                const output = {
                    'status': 200,
                    'code': 'SC_04',
                    'message': 'shopping cart clear',
                    'field': 'cart_id'
                };
                helper.display(res, output, 200);
            }
        } catch (err) {
            helper.display(res, {'code': 'SC_05', 'message': err.message});
        }
    },
    removeProduct: async function(req, res) {
        const { item_id } = req.params;
        const validator = new nodeInputValidation({ item_id }, {
            item_id: 'required|integer'
        });

        try {
            const matched = await validator.check();
            if (!matched) {
                helper.display(res, shoppingCartValidation.message(validator.errors));
                return;
            }

            const response = await shoppingCartModel.deleteRow({ item_id });

            if (response === null) {
                helper.display(res, {'code': 'SC_03', 'message': 'Do not exist item with this ID'});
            } else {
                const output = {
                    'status': 200,
                    'code': 'SC_06',
                    'message': 'Item cart removed',
                    'field': 'item_id'
                };
                helper.display(res, output, 200);
            }
        } catch (err) {
            helper.display(res, {'code': 'SC_05', 'message': err.message});
        }
    }
}