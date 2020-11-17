const express = require('express');
const home = require('../controller/home')
// const profile1  =require('../controller/profile')

const router = express.Router();


router.post('/createHomes',home.createHomes);
router.get('/home/:id', home.home);
module.exports = router
