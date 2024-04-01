const path = require("path");
const productModel = require(path.join(__dirname, '..', 'models', 'api', 'ProductModel'));
const productValidation = require(path.join(__dirname, '..', 'utils', 'validation', 'ProductValidation'));
const product = require(path.join(__dirname, '..', 'utils', 'handler', 'ProductHandler'));
const helper = require(path.join(__dirname, '..', 'utils', 'CustomHelper'));
const nodeInputValidation = require('node-input-validator');

async function validate(req, res, validator) {
    const isValid = await validator.check();
    if (!isValid) {
        return helper.display(res, productValidation.message(validator.errors));
    }
    product.find(req, res, productModel, helper);
}

module.exports = {
    name: 'Product',
    all: async function(req, res) {
        try {
            const validator = new nodeInputValidation(req.query, {
                page: 'integer',
                limit: 'integer',
                description_length: 'integer'
            });
            await validate(req, res, validator);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },
    search: async function(req, res, next) {
        const validator = new nodeInputValidation(req.query, {
            query_string: 'required',
            page: 'integer',
            limit: 'integer',
            description_length: 'integer'
        });
        await validate(req, res, validator);
    },
    detail: async function(req, res, next) {
        const validator = new nodeInputValidation(req.params, {
            product_id: 'required|integer'
        });
        await validate(req, res, validator);
    },
    category: async function(req, res, next) {
        const validator = new nodeInputValidation(req.params, {
            category_id: 'required|integer',
            page: 'integer',
            limit: 'integer',
            description_length: 'integer'
        });
        await validate(req, res, validator);
    },
    department: async function(req, res, next) {
        const validator = new nodeInputValidation(req.params, {
            department_id: 'required|integer',
            page: 'integer',
            limit: 'integer',
            description_length: 'integer'
        });
        await validate(req, res, validator);
    }
}