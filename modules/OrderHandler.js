const config = require(__dirname + "/../config/setting")();
const nodeMailer = require('nodemailer');

/* 
 * Send order confirmation email
 * 
 * @param res 
 * @param customer  has customer data
 * @param product   has product data
 * @param helper use for response message 
 *
 * return object
 */
var sendEmail = function(res, customer, product, helper) {
    let transporter = nodeMailer.createTransport(config.mail);

    let html = '';
    html += "Hello " + customer.data.name + ",";
    html += "<p>You have made your order successfully!</p>";
    html += "<p>Regards,</p>";
    html += "<p>"+config.admin.name+"</p>";

    var mailOptions = {
        from: config.admin.email,
        to: customer.data.email,
        subject: 'Order Confirmation',
        html: html
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            helper.display(res, error, 400);
        } else {
            output = {
                'orderId': product.id
            };
            helper.display(res, output, 200);
        }
    });
}

exports.sendEmail = sendEmail;