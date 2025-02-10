const mongoose = require('mongoose');

const ManagerSchema = new mongoose.Schema({
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User schema
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNo: { type: String },
  address: { type: String },
  description:{type: String},
  managedArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }], // List of artist IDs
  managerShare:{type:Number},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Manager', ManagerSchema,'Manager');
