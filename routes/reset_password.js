const express = require('express');
const router = express.Router();
const passport = require('passport');
const resetPasswordController = require('../controllers/reset_password_controller');
const resetAccessToken = require('../models/resetAccessToken');

router.get('/check-mail', resetPasswordController.checkMail);
router.post('/check-user', resetPasswordController.checkUser);
router.get('/:accessToken', resetPasswordController.passwordForm);
router.post('/update-password/:accessToken', resetPasswordController.updatePassword);


module.exports = router;