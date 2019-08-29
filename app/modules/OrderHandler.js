const nodeMailer = require('nodemailer');

/**
 * Send order confirmation email
 * 
 * @param {object} res express response object
 * @param {object} customer has customer data
 * @param {object} orderId for order id
 * @param {object} helper response message
 *
 * @return object
 */
sendEmail = function(res, customer, orderId, helper) {
    mailerConfig = {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    };

    transporter = nodeMailer.createTransport(mailerConfig);

    html = '';
    html += 'Hello ' + customer.data.name + ',';
    html += '<p>You have made your order successfully!</p>';
    html += '<p>Regards,</p>';
    html += '<p>' + process.env.ADMIN_NAME + '</p>';

    mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: customer.data.email,
        subject: 'Order Confirmation',
        html: html
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            helper.display(res, {
                'code': 'E_01',
                'message': error
            });
        } else {
            helper.display(res, {
                'orderId': orderId
            }, 200);
        }
    });
}

exports.sendEmail = sendEmail;