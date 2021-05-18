const kue = require('kue');
const queue = kue.createQueue();


// 
var kueUiExpress = require('kue-ui-express');
var express = require('express');
var kueapp = express();
kueUiExpress(kueapp, '/kue/', '/kue-api');
kueapp.use('/kue-api/', kue.app);
kueapp.listen(3000);

module.exports = queue;