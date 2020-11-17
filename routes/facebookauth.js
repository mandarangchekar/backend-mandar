const express = require('express');
const facebook =require('../controller/googleauth')
const router = express.Router();

router.post('/facebookSignup',facebook.signup);
router.post('/facebooklogin',facebook.login);

module.exports = router