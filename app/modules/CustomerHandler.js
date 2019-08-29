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
    customerModel.updateRow(requestData, customerData).then((response) => {
        if (response == 'NotFound') {
            cstHelper.display(res, {
                'code': 'USR_05',
                'message': "Record doesn't exist"
            });
        } else {
            // Return data
            cstHelper.display(res, response, 200);
        }
    }).catch((err) => {
        cstHelper.display(res, {
            'code': 'USR_10',
            'message': err
        });
    });
}

exports.update = update;