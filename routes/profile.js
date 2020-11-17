const express = require('express');
const profile =require('../controller/profile')
// const profile1  =require('../controller/profile')

const router = express.Router();

router.get('/user/:id', profile.userData);
router.get('/user', profile.allUserData);
router.post('/create',profile.create);
module.exports = router
