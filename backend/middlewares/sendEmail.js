const nodeMailer = require('nodemailer');

exports.sendEmail = async (option) => {

    const transporter = await nodeMailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "52e0762281a2c3",
            pass: "26040ca8ea19f2"
        }
    });

    const mailOption = {
        from: process.env.SMPT_MAIL,
        to: option.email,
        subject: option.subject,
        text: option.message
    }
    await transporter.sendMail(mailOption)

}
