// const mongoose = require('mongoose');
// const songService = require('../services/songService');

const mongoose = require('mongoose');
const songService = require('../services/songService');
const royaltyController = require('../controllers/royaltyController');
const Artist= require('../models/artistModel');
const Song = require('../models/songModel');
const Royalty = require('../models/royaltyModel');

exports.uploadSong = async (req, res) => {
  try {
    console.log("song request",req.body)
    if (!req.body.artistName || !req.body.songName) {
      return res.status(400).json({ message: "Missing required fields: artistName, songName" });
    }
    console.log(req.body.artistName, "artistname")

    // Generate artistId and songId
    const artistId = req.body.artistName.toLowerCase().replace(/\s+/g, '-');
    const songId = req.body.songName.toLowerCase().replace(/\s+/g, '-');
    const royaltyId= req.body.artistName.toLowerCase().replace(/\s+/g, '-');

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
        royaltyId: royaltyId,  // Royalty ID based on artistId format
        artistId: song.artistId,  // Reference to the artist's ObjectId
        songId: song._id, 
        songName:song.songName, // Reference to the song's ObjectId
        artistName: song.artistName // Reference to the artist's
      }
    };

    await Artist.findByIdAndUpdate(
        song.artistId,
        {$addToSet:{songs:song._id}},
        {new:true}

    );

    // Mock response object for internal function call
    const royaltyRes = {
      status: (statusCode) => ({
        json: (data) => console.log(`Royalty creation response:`, data),
      }),
    };

    await royaltyController.createRoyaltyController(royaltyReq, royaltyRes);

    res.status(201).json({ success: "Song and Royalty created successfully", song });
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
    res.status(200).json({success:true, songs});
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
    const { songId } = req.params;
 
    if (!songId) {
      return res.status(400).json({ message: "Missing required field: songId" });
    }
 
    // Find the song to get related artistId before deletion
    const song = await Song.findOne({ songId:songId });
 
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
 
    const artist = await Artist.findOne({ _id: song.artistId });
 
    if (!artist) {
      return res.status(404).json({ message: "Associated artist not found" });
    }
 
    // Delete song from Songs collection
    await Song.deleteOne({ songId });
 
    // Remove song reference from the Artist's songs array
    await Artist.findOneAndUpdate(
      { _id: artist._id },
      { $pull: { songs: song._id } },
      { new: true }
    );
 
    // Delete the corresponding royalty entry
    const royaltyDeleteResult = await Royalty.deleteOne({ songId: song._id });
 
    res.status(200).json({
      message: "Song and associated data deleted successfully",
      deletedSong: songId,
      royaltyDeleted: royaltyDeleteResult.deletedCount > 0,
      artistSongDeleted:artist._id // Ensure royalty was actually deleted
    });
  } catch (error) {
    console.error("Error deleting song:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
