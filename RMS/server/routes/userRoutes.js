const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/:username', userController.getUserByUsername);
router.put('/:username', userController.updateUser);
router.delete('/:username', userController.deleteUser);
router.get('/role/:role', userController.getAllUsers);

module.exports = router;