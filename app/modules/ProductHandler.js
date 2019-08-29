/**
 * Find data
 * Used page number, record limit and description length
 *
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {object} productModel product model object
 * @param {object} cstHelper response message
 *
 * @return object
 */
find = function(req, res, productModel, cstHelper) {
    qs = (req.query.query_string == undefined || req.query.query_string == '') ?
        '' : req.query.query_string;
    page = (req.query.page == undefined || req.query.page == '') ?
        1 : req.query.page;
    limit = (req.query.limit == undefined || req.query.limit == '') ?
        20 : req.query.limit;
    desLen = (req.query.description_length == undefined || req.query.description_length == '') ?
        200 : req.query.description_length;
    did = (req.params.department_id == undefined || req.query.department_id == '') ?
        '' : req.params.department_id;
    cid = (req.params.category_id == undefined || req.query.category_id == '') ?
        '' : req.params.category_id;
    pid = (req.params.product_id == undefined || req.params.product_id == '') ?
        '' : req.params.product_id;

    if (cid > 0 || did > 0) {
        productModel.getByCatProId(page, limit, desLen, cid, did)
            .then((data) => {
                cstHelper.display(res, data, 200);
            }).catch((err) => {
                cstHelper.display(res, {
                    'code': 'PRO_10',
                    'message': err
                });
            });
    } else if (pid > 0) {
        productModel.getById({
                product_id: pid
            })
            .then((data) => {
                cstHelper.display(res, data, 200);
            }).catch((err) => {
                cstHelper.display(res, {
                    'code': 'PRO_10',
                    'message': err
                });
            });
    } else {
        productModel.getProducts(page, limit, desLen, qs)
            .then((data) => {
                cstHelper.display(res, data, 200);
            }).catch((err) => {
                cstHelper.display(res, {
                    'code': 'PRO_10',
                    'message': err
                });
            });
    }
}

exports.find = find;