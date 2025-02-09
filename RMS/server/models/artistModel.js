const mongoose = require('mongoose');
 
const ArtistSchema = new mongoose.Schema({
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User schema
  username:{ type:String, required: true},
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNo: { type: String },
  address: { type: String },
  description:{type: String},
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }], // List of song IDs
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' }, // List of other artists they collaborate with
  fullRoyalty:{type:Number, default:0},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
 
module.exports = mongoose.model('Artist', ArtistSchema,'Artist');
 
 