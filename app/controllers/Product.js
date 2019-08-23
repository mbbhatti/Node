const productModel = require(__dirname + "/../models/api/ProductModel");
const productValidation = require(__dirname + "/../modules/ProductValidation");
const product = require(__dirname + '/../modules/ProductHandler');
const helper = require(__dirname + '/../modules/CustomHelper');
const v = require('node-input-validator');

const validation = new productValidation();

module.exports = {
    name: "Product",
    all: function(req, res, next) 
    {
        validator = new v( req.query, {
            page :'integer',
            limit :'integer',
            description_length :'integer'
        });

        validator.check().then(function (matched) {
            if (!matched) {              
                helper.display(res, validation.message(validator.errors));
            } else {                
                product.find(req, res, productModel, helper);    
            }
        });
        
    },
    search: function(req, res, next) 
    {        
        validator = new v( req.query, {
            query_string :'required',
            page :'integer',
            limit :'integer',
            description_length :'integer'
        });

        validator.check().then(function (matched) {
            if (!matched) {              
                helper.display(res, validation.message(validator.errors));
            } else {                
                product.find(req, res, productModel, helper);
            }
        });  
    },
    detail: function(req, res, next) 
    {
        validator = new v( req.params, {
            product_id :'required|integer'
        });

        validator.check().then(function (matched) {
            if (!matched) {                                
                helper.display(res, validation.message(validator.errors));
            } else {
                product.find(req, res, productModel, helper);
            }
        });  
    },
    category: function(req, res, next) 
    {         
        validator = new v( req.params, {
            category_id :'required|integer',
            page :'integer',
            limit :'integer',
            description_length :'integer'
        });

        validator.check().then(function (matched) {
            if (!matched) {                                
                helper.display(res, validation.message(validator.errors));
            } else {          
                product.find(req, res, productModel, helper);
            }
        });  
    },
    department: function(req, res, next) 
    {         
        validator = new v( req.params, {
            department_id :'required|integer',
            page :'integer',
            limit :'integer',
            description_length :'integer'
        });

        validator.check().then(function (matched) {
            if (!matched) {                                
                helper.display(res, validation.message(validator.errors));
            } else {         
                product.find(req, res, productModel, helper);
            }
        });  
    }
}