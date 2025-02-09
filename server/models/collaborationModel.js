const mongoose = require('mongoose');

const CollaborationSchema = new mongoose.Schema({
  collaborationId: { type: String, required: true, unique: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  collaborationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  songsManaged: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }], // Array of songs managed
});

module.exports = mongoose.model('Collaboration', CollaborationSchema, 'Collaboration');
