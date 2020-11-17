const express = require('express');
const google =require('../controller/googleauth')
const router = express.Router();



router.post('/googleSignup',google.signup);
router.post('/googlelogin',google.login);



module.exports = router