
const util = require('../config').util;
const utilOptions = require('../config').utilOptions;



// ---------------------- @sendgrid/mail ----------------------- //

// // using Twilio SendGrid's v3 Node.js Library
// // https://github.com/sendgrid/sendgrid-nodejs
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY : require('../secrets.json').SENDGRID_API_KEY);

// module.exports = {
//     sendMail: function(from, to, subject, text, html) {
//         console.log('from mail : ', from);
//         console.log('to mail : ', to);
//         const msg = {
//             to,
//             from,
//             subject: subject ? subject : 'Welcome to the organizer',
//             text: text ? text : 'we are glad you are here',
//             html: html ? html : '<p>we are glad you are here</p>',
//         };

//         sgMail.send(msg).then((success) => {
//             console.log('success send mail');
//         }).catch((err) => {
//             console.error('error send mail : ', util.inspect(err, utilOptions));
//         });
//     }
// }



// ------------------ nodemailer ------------------------ //

const nodemailer = require("nodemailer");
const User = require('../models/user/user');
const mailConfirmedRedirectUrl = process.env.EMAIL_CONFIRMATION_REDIRECT_URL ? process.env.EMAIL_CONFIRMATION_REDIRECT_URL : require('../secrets').EMAIL_CONFIRMATION_REDIRECT_URL;

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
//let testAccount = await nodemailer.createTestAccount();

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: process.env.MAILGUN_DOMAIN_USERNAME ? 465 : 587,
    //port: 465,
    secure: process.env.MAILGUN_DOMAIN_USERNAME ? true : false, // true for 465, false for other ports
    auth: {
        user: process.env.MAILGUN_DOMAIN_USERNAME ? process.env.MAILGUN_DOMAIN_USERNAME : require('../secrets.json').MAILGUN_DOMAIN_USERNAME,
        pass: process.env.MAILGUN_DOMAIN_PASSWORD ? process.env.MAILGUN_DOMAIN_PASSWORD : require('../secrets.json').MAILGUN_DOMAIN_PASSWORD,
    }
});

module.exports = {
    sendMail: function(from, to, subject, text, html) {
        return new Promise((resolve, reject) => {
            User.findOne({
                where: {
                    email: to
                }
            }).then((user) => {
                console.log('success find user when sendmail');
                
                transporter.sendMail({
                    from,
                    to,
                    subject: subject ? subject : "Hello to the organizer ✔", // Subject line
                    text: text ? text : "Hello world?", // plain text body
                    html: html ? html : `<b>Hello . please click on <a href="${mailConfirmedRedirectUrl}?code=${user.dataValues.email_verification_code}">this link</a> to confirm</b>` // html body
                }).then((success) => {
                    console.log('success send email with nodemailer : ');
                    resolve('success send email');
                }).catch((err) => {
                    console.error('error send email with nodemailer : ', util.inspect(err, utilOptions));
                    res.redirect(process.env.EMAIL_CONFIRMATION_ERROR_REDIRECT_URL ? process.env.EMAIL_CONFIRMATION_ERROR_REDIRECT_URL : require('./secrets.json').EMAIL_CONFIRMATION_ERROR_REDIRECT_URL);
                    reject('error send mail');
                });
                
            }).catch((errorFind) => {
                console.log('error find user when send email with nodemailer : ', util.inspect(errorFind, utilOptions));
                return cb('error verify email');
            });
        });
    }
};


// ---------------- mailgun-js --------------- //

// var domain = process.env.MAILGUN_DOMAIN ? process.env.MAILGUN_DOMAIN : require('../secrets.json').MAILGUN_DOMAIN;
// var apiKey = process.env.MAILGUN_API_KEY ? process.env.MAILGUN_API_KEY : require('../secrets.json').MAILGUN_API_KEY
// var mailgun = require('mailgun-js')({apiKey, domain});

// module.exports = {
//     sendMail: function(from, to, subject, text) {
//         console.log('from mail : ', from);
//         console.log('to mail : ', to);

//         const msg = {
//             to,
//             from,
//             subject: subject ? subject : 'Welcome to the organizer',
//             text: text ? text : 'we are glad you are here',
//             //html: html ? html : '<p>we are glad you are here</p>',
//         };

//         console.log('email msf object to send mailgun : ', util.inspect(msg, utilOptions));

//         mailgun.messages().send(msg, function (error, body) {
//             if (!error) {
//                 console.log('success send mail with mailgun');
//             }
//             else {
//                 console.error('error send mail with mailgun : ', util.inspect(error, utilOptions));
//             }
//         });
//     }
// }