const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  collaborators: [{ type: String }], // List of collaborator names or IDs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports =  mongoose.models.Song || mongoose.model('Song', SongSchema,'Song');
