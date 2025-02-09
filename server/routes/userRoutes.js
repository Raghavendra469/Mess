const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// const { verifyUser } = require('../middleware/authMiddleware.js'); 

router.post('/', userController.createUser);
router.get('/:username', userController.getUserByUsername);
router.put('/:username', userController.updateUser);
router.delete('/:username', userController.deleteUser);
router.get('/role/:role', userController.getAllUsers);
router.put('/toggle/:id',  userController.toggleUserStatus);

module.exports = router;