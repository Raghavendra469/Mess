


const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true}, // Generated from artistName
  artistName: { type: String, required: true },
  songId: { type: String, required: true, unique: true }, // Generated from songName
  songName: { type: String, required: true },
  title: { type: String, required: true },
  totalStreams: { type: Number, default: 0 },
  totalRoyalty: { type: Number, default: 0 }, // 🔥 New Field
  releaseDate: { type: Date, default: Date.now},
  collaborators: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to automatically generate artistId and songId
songSchema.pre('save', function (next) {
  this.artistId = this.artistName.toLowerCase().replace(/\s+/g, '-');
  this.songId = this.songName.toLowerCase().replace(/\s+/g, '-');
  next();
});
module.exports = mongoose.model('Song', songSchema, 'Song');


