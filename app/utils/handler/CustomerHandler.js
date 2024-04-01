/**
 * Update customer record.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {object} customerData - Customer data object.
 * @param {object} requestData - Request data object.
 * @param {object} customerModel - Customer model object.
 * @param {object} cstHelper - Response message helper.
 */
exports.update = function(req, res, customerData, requestData, customerModel, cstHelper) {
    customerModel.updateRow(requestData, customerData)
        .then(response => {
            if (response === null) {
                cstHelper.display(res, {code: 'USR_05', message: 'Record does not exist'});
            } else {
                cstHelper.display(res, response, 200);
            }
        })
        .catch(err => {
            cstHelper.display(res, {code: 'USR_10', message: err.message || 'Internal Server Error'});
        });
};