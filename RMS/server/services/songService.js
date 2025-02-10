const Song = require('../models/songModel');

exports.createSong = async (songData) => {
  
  return await Song.create(songData);
};

exports.findSongById = async (songId) => {
  return await Song.findOne({ songId });
};

exports.findSongsByArtistId = async (artistId) => {
  return await Song.find({ artistId });
};

exports.findSongsBySongId = async (songId) => {
  return await Song.find({ songId });
};

exports.modifySong = async (songId, updateData) => {
  return await Song.findOneAndUpdate({ songId }, updateData, { new: true });
};

exports.removeSong = async (songId) => {
  return await Song.findOneAndDelete({ songId });
};
