const nodemailer = require('../config/nodemailer');


// this is another way of exporting methods
exports.newAccessToken = (accessToken) => {
    // console.log('Inside new comment mailer', comment)
    let htmlString = nodemailer.renderTemplate({accessToken: accessToken}, '/accessToken/accessToken.ejs');
    nodemailer.transporter.sendMail({
        // this from doesn't matter much, it uses the auth user in nodemailer.js config file
        from: 'admin@codeial.com',
        to: accessToken.user.email, 
        subject: 'Reset Password',
        html: htmlString
    }, (err, info) => {
        if (err){console.log('error in sending email', err); return}
        // console.log('Mail delivered', info);
        return;
    });
}