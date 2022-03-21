const sendgrid = require('@sendgrid/mail');

exports.send = async ({ to, subject, body }) => {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

    sendgrid.send({
        from: process.env.FROM,
        to,
        subject,
        html: body

    });

};