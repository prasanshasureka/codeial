const express = require('express');
const router = express.Router();
console.log('Router Running');
const homeController = require('../controllers/home_controller');
const userController = require('../controllers/user_controller');
const { route } = require('./users');


router.get('/', homeController.home);
router.use('/user', require('./users'));
router.use('/posts', require('./posts'));


module.exports = router;