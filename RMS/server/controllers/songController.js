const SongService = require('../services/songService');
const songService= new SongService();

class SongController {
  async uploadSong(req, res) {
    try {
      console.log("song request", req.body);
      if (!req.body.artistName || !req.body.songName) {
        return res.status(400).json({ message: "Missing required fields: artistName, songName" });
      }

      const artistName = req.body.artistName;
      const songName = req.body.songName;

      const songData = {
        songId: songName.toLowerCase().replace(/\s+/g, '-'),
        artistId: artistName.toLowerCase().replace(/\s+/g, '-'),
        totalStreams: 0,
        ...req.body
      };

      const { song, newRoyalty } = await songService.uploadSong(songData, artistName, songName);


      res.status(201).json({ success: "Song and Royalty created successfully", song });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getSongById(req, res) {
    try {
      const song = await songService.getSongById(req.params.songId);
      if (!song) return res.status(404).json({ message: 'Song not found' });
      res.json(song);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getSongsByArtistId(req, res) {
    try {
      const songs = await songService.getSongsByArtistId(req.params.artistId);
      res.status(200).json({ success: true, songs });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getSongsBySongId(req, res) {
    try {
      const songs = await songService.getSongsBySongId(req.params.songId);
      res.json(songs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateSong(req, res) {
    try {
      req.body.updatedAt = new Date();
      
      if (req.body.songName) {
        req.body.songId = req.body.songName.toLowerCase().replace(/\s+/g, '-');
      }
      if (req.body.artistName) {
        req.body.artistId = req.body.artistName.toLowerCase().replace(/\s+/g, '-');
      }

      const updatedSong = await songService.updateSong(req.params.songId, req.body);
      if (!updatedSong) return res.status(404).json({ message: 'Song not found' });
      res.json(updatedSong);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteSong(req, res) {
    try {
      const { songId } = req.params;
      
      if (!songId) {
        return res.status(400).json({ message: "Missing required field: songId" });
      }

      const deletedSong = await songService.deleteSong(songId);
     
      res.status(200).json({
        message: "Song and associated data deleted successfully",
        deletedSong: deletedSong.songId,
        royaltyDeleted: true
      });
    } catch (error) {
  
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }
}

module.exports = new SongController();
