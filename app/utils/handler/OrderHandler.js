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
exports.sendEmail = function(res, customer, orderId, helper) {
    // Create transporter with mailer configuration
    const transporter = nodeMailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    // Compose email HTML content
    const html = `
        <p>Hello ${customer.data.name},</p>
        <p>You have made your order successfully!</p>
        <p>Regards,</p>
        <p>${process.env.ADMIN_NAME}</p>
    `;

    // Set mail options
    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: customer.data.email,
        subject: 'Order Confirmation',
        html: html
    };

    // Send email
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            // Handle email sending error
            helper.display(res, {'code': 'E_01', 'message': error.message || 'Failed to send email'});
        } else {
            // Display success response
            helper.display(res, {'orderId': orderId}, 200);
        }
    });
}