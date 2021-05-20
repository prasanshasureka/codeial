const express = require('express');
const router = express.Router();
console.log('Router Running');
const homeController = require('../controllers/home_controller');


router.get('/', homeController.home);
router.use('/user', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comment', require('./comment'));
router.use('/reset_password', require('./reset_password'));
router.use('/likes', require('./like'));

router.use('/api', require('./api'));


module.exports = router;