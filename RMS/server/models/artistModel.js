const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User schema
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNo: { type: String },
  address: { type: String },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }], // List of song IDs
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }], // List of other artists they collaborate with
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Artist', ArtistSchema,'Artist');
