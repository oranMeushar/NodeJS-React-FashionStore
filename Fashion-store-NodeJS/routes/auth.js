const express = require('express');
const authController = require('../controllers/authController');
const protected = require('../middleware/protected');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:resetToken', authController.resetPassword);

router.get('/isAuth', protected, authController.isAuth);
router.get('/logout', protected, authController.logout);
module.exports = router;