const express = require('express');
const { login, verify } = require('../controllers/authcontroller.js');
const { verifyUser } = require('../middleware/authMiddleware.js'); 


    // console.log("this is auht.js error")
    const router = express.Router();
    // console.log("this is auht.js 2")

    router.post('/login', login);
    // console.log("this is auht.js 3")

    router.get('/verify', verifyUser, verify);
    // router.get('/users', verifyUser, getUsers);
    // router.put('/users/:id', verifyUser, toggleUserStatus);
    // router.get('/songs', verifyUser, getSongs);



module.exports = router;
