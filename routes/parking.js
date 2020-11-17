const express = require('express');
const profile =require('../controller/profile')
// const profile1  =require('../controller/profile')

const router = express.Router();


router.post('/createParks',profile.createParks);
module.exports = router
