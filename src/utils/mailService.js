const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = ({ to, subject, text, html, attachments = [] }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
        attachments,
    };

    return transporter.sendMail(mailOptions);
};

const sendBulkMail = (emailList, { subject, text, html }) => {
    return sendMail({
        to: emailList,
        subject,
        text,
        html,
    });
};

module.exports = {
    sendMail,
    sendBulkMail,
};