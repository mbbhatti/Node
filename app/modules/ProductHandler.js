/* 
 * Find data
 * 
 * @param req 
 * @param res 
 * @param productModel  product model object
 * @param cstHelper     use for response message
 *
 * return object
 */
var find = function(req, res, productModel, cstHelper) 
{
    var qs = (req.query.query_string == undefined || req.query.query_string == '') 
                ? '' : req.query.query_string;
    var page = (req.query.page == undefined || req.query.page == '') 
                ? 1 :req.query.page;
    var limit = (req.query.limit == undefined || req.query.limit == '') 
                ? 20 :req.query.limit;
    var desLen = (req.query.description_length == undefined  || req.query.description_length == '') 
                ? 0 :req.query.description_length;
    var did = (req.params.department_id == undefined  || req.query.department_id == '') 
                ? '' : req.params.department_id;  
    var cid = (req.params.category_id == undefined || req.query.category_id == '') 
                ? '' : req.params.category_id;
    var pid = (req.params.product_id == undefined || req.params.product_id == '') 
                ? '' : req.params.product_id;
    
    productModel.setDB(req.db);   

    if(cid > 0 || did > 0) {
        productModel.getByCatProId(page, limit, desLen, cid, did, 
            function(err, data) {
                if(!err) {
                    cstHelper.display(res, data, 200);
                } else {
                    cstHelper.display(res, err, 400);
                }           
            }
        );
    } else if(pid > 0) {
        productModel.getById(pid, function(err, data) {
            if(!err) {
                cstHelper.display(res, data, 200);
            } else {
                cstHelper.display(res, err, 400);  
            }           
        });
    } else {
        productModel.getProducts(page, limit, desLen, qs, 
            function(err, data) {
                if(!err) {
                    cstHelper.display(res, data, 200);
                } else {
                    cstHelper.display(res, err, 400);  
                }          
            }
        );
    }    
}

exports.find = find;