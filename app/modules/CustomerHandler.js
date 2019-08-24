/**
 * Update customer record
 *
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {object} customerData object 
 * @param {object} requestData object  
 * @param {object} customerModel customer model object
 * @param {object} cstHelper response message
 *
 * @return object
 */
update = function(req, res, customerData, requestData, customerModel, cstHelper) {        
    customerModel.setDB(req.db);
    customerModel.updateRow(requestData, customerData, function(error, response) {
        if (!error) {
            cstHelper.display(res, response, 200);
        } else {
            output = {
                'status': 404,
                'code': 'USR_05',
                'message': "Record doesn't exist",
                'field': 'DB'
            };
            cstHelper.display(res, output, 404);
        }
    });
}

exports.update = update;