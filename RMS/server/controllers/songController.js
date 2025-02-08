// const mongoose = require('mongoose');
// const songService = require('../services/songService');

const mongoose = require('mongoose');
const songService = require('../services/songService');
const royaltyController = require('../controllers/royaltyController');

exports.uploadSong = async (req, res) => {
  try {
    if (!req.body.title || !req.body.artistName || !req.body.songName) {
      return res.status(400).json({ message: "Missing required fields: title, artistName, songName" });
    }

    // Generate artistId and songId
    const artistId = req.body.artistName.toLowerCase().replace(/\s+/g, '-');
    const songId = req.body.songName.toLowerCase().replace(/\s+/g, '-');

    // Create song data
    const songData = {
      _id: new mongoose.Types.ObjectId(),
      songId,
      artistId,
      totalStreams: 0,
      ...req.body
    };

    // Save song to database
    const song = await songService.createSong(songData);

    // Call the createRoyaltyController to create the linked royalty entry
    const royaltyReq = {
      body: {
        royaltyId: artistId,  // Royalty ID based on artistId format
        artistId: song.artistId,  // Reference to the artist's ObjectId
        songId: song._id,  // Reference to the song's ObjectId
      }
    };

    // Mock response object for internal function call
    const royaltyRes = {
      status: (statusCode) => ({
        json: (data) => console.log(`Royalty creation response:`, data),
      }),
    };

    await royaltyController.createRoyaltyController(royaltyReq, royaltyRes);

    res.status(201).json({ message: "Song and Royalty created successfully", song });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getSongById = async (req, res) => {
  try {
    const song = await songService.findSongById(req.params.songId);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSongsByArtistId = async (req, res) => {
  try {
    const songs = await songService.findSongsByArtistId(req.params.artistId);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSongsBySongId = async (req, res) => {
  try {
    const songs = await songService.findSongsBySongId(req.params.songId);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSong = async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    
    // If songName or artistName is updated, update songId and artistId accordingly
    if (req.body.songName) {
      req.body.songId = req.body.songName.toLowerCase().replace(/\s+/g, '-');
    }
    if (req.body.artistName) {
      req.body.artistId = req.body.artistName.toLowerCase().replace(/\s+/g, '-');
    }

    const updatedSong = await songService.modifySong(req.params.songId, req.body);
    if (!updatedSong) return res.status(404).json({ message: 'Song not found' });
    res.json(updatedSong);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSong = async (req, res) => {
  try {
    const deleted = await songService.removeSong(req.params.songId);
    if (!deleted) return res.status(404).json({ message: 'Song not found' });
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
