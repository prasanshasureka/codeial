const queue = require('../config/kue');
const accessTokenMailer = require('../mailers/reset_access_token_mailer');

queue.process('resetEmails', function(job, done){
    // console.log('emails worker is processing a reset job..', job.data);
    accessTokenMailer.newAccessToken(job.data);
    done();
})