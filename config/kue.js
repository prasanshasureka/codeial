const kue = require('kue');
const queue = kue.createQueue();
console.log('Redis running')

// add kue ui
var kueUiExpress = require('kue-ui-express');
var express = require('express');
var kueapp = express();
kueUiExpress(kueapp, '/kue/', '/kue-api');
kueapp.use('/kue-api/', kue.app);
kueapp.listen(3000);

module.exports = queue;