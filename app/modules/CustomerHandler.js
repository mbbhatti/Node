/**
 * Update customer record
 *
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {inetger} cid indicates customer id
 * @param {object} data customer 
 * @param {object} customerModel customer model object
 * @param {object} cstHelper response message
 *
 * @return object
 */
update = function(req, res, cid, data, customerModel, cstHelper) {
    // Set query condition
    where = " customer_id ='" + cid + "'";

    // DB update process 
    customerModel.setDB(req.db);
    customerModel.updateRow(data, where, function(error, response) {
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