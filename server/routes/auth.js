const express = require('express');
const { login, verify, getUsers, toggleUserStatus, getSongs } = require('../controllers/authcontroller.js');
const { verifyUser } = require('../middleware/authMiddleware.js'); 


    
    const router = express.Router();
    

    router.post('/login', login);
   

    router.get('/verify', verifyUser, verify);
    router.get('/users', verifyUser, getUsers);
    router.put('/users/:id', verifyUser, toggleUserStatus);
    router.get('/songs', verifyUser, getSongs);



module.exports = router;
