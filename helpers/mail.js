
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
            // send mail with defined transport object
            transporter.sendMail({
                from,
                to,
                subject: subject ? subject : "Hello to the organizer ✔", // Subject line
                text: text ? text : "Hello world?", // plain text body
                html: html ? html : "<b>Hello world?</b>" // html body
            }).then((success) => {
                console.log('success send mail with nodemailer : ');
                resolve('success send mail');
            }).catch((err) => {
                console.error('error send mail with nodemailer : ', util.inspect(err, utilOptions));
                reject('error send mail');
            });

            // Preview only available when sending through an Ethereal account
            //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
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