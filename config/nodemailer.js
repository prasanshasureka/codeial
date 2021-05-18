const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: 'prasanshasureka98@gmail.com',
        pass: 'prasanshA123'
    }
});

let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        // realtivePath is the place from which this function is being called
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if (err){console.log('error is rendering template', err); return;}
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}