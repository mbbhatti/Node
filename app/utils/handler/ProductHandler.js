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
exports.find = function(req, res, productModel, cstHelper) {
    const { query_string, page: rawPage, limit: rawLimit, description_length: rawDesLen } = req.query;
    const { department_id, category_id, product_id } = req.params;

    const defaultPage = 1;
    const defaultLimit = 20;
    const defaultDesLen = 200;

    const page = parseInt(rawPage) || defaultPage;
    const limit = parseInt(rawLimit) || defaultLimit;
    const desLen = parseInt(rawDesLen) || defaultDesLen;

    const cid = parseInt(category_id) || '';
    const did = parseInt(department_id) || '';
    const pid = parseInt(product_id) || '';

    let promise;

    if (cid > 0 || did > 0) {
        promise = productModel.getByCatProId(page, limit, desLen, cid, did);
    } else if (pid > 0) {
        promise = productModel.getById({ product_id: pid });
    } else {
        promise = productModel.getProducts(page, limit, desLen, query_string || '');
    }

    promise.then((data) => {
        cstHelper.display(res, data, 200);
    }).catch((err) => {
        cstHelper.display(res, {
            'code': 'PRO_10',
            'message': err
        });
    });
}