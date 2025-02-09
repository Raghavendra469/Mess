const userService = require('../services/userService');
const User =require('../models/userModel.js');
// const User = require('../models/userModel');

// const createUser = async (req, res) => {
//   try {
//     // console.log(req.body)
//     const user = await userService.createUser(req.body);
//     console.log(user);
//     // res.status(201).json(user);
//     return res.status(201).json({ ok: true, user });
    
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

const createUser = async (req, res) => {
  try {
    // console.log(`req.body.role: ${req.body.role}`);
    const user = await userService.createUser(req.body);
    return res.status(201).json({ ok: true, user });
  } catch (error) {
    // console.error("Error creating user:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getUserByUsername = async (req, res) => {
  try {
    console.log(req.params.username)
    const user = await userService.getUserByUsername(req.params.username);
    console.log(user);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ success: true, user });
    console.log(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    // console.log(req.headers,"req.headers")
    // console.log(req.params.username,"username",req.body,"req.body")
    const user = await userService.updateUser(req.params.username, req.body);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const success = await userService.deleteUser(req.params.username);
    if (success) res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.params.role);
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
      const { id } = req.params;
      const { isActive } = req.body;
      const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
      console.log(user,"user")
      if (!user) {
          return res.status(404).json({ success: false, error: 'User not found' });
      }
      return res.status(200).json({ success: true, user });
  } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
  }
};





module.exports = {
  createUser,
  getUserByUsername,
  updateUser,
  deleteUser,
  getAllUsers,
  toggleUserStatus
};