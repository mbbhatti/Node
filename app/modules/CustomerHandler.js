/* 
 * Update customer record
 *
 * @param req
 * @param res 
 * @param cid           Indicates customer id
 * @param data          Modified customer data 
 * @param customerModel customer model object
 * @param cstHelper     use for response message
 * @param callback      function
 *
 * return object
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