const nodemailer = require("nodemailer");



const sendemail = async (req) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "samranvirk44@gmail.com",
                pass: "hittl1950",
            },
        });
        let mailOption = {
            from: "samranvirk44@gmail.com", // sender address
            to: "samran.virk@techverx.com", // list of receivers
            subject: "Open Query", // Subject line
            text: `Hello, ${req}`, // plain text body
        }
        let mail = await transporter.sendMail(mailOption);
        return mail
    } catch (err) {
        return err;
    }
}
const sendemailforgotPassword = async (req) => {
    try {
        console.log(req)
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "samranvirk44@gmail.com",
                pass: "hittler1950",
            },
        });
        let mailOption = {
            from: "samranvirk44@gmail.com", // sender address
            to: req.mail, // list of receivers
            subject: "Password Changed", // Subject line
            text: req.password, // plain text body
        }
        let mail = await transporter.sendMail(mailOption);
        console.log(mail)
        return mail
    } catch (err) {
        return err;
    }
}

module.exports = {
    sendemail,
    sendemailforgotPassword
}