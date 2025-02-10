/*const { createRoyalty, getRoyaltyById } = require('../services/royaltyService');

// POST API to create a new royalty
const createRoyaltyController = async (req, res) => {
    try {
        const { royaltyId, artistId, songId} = req.body;

        const newRoyalty = await createRoyalty({ royaltyId, artistId, songId});

        res.status(201).json({ message: 'Royalty created successfully', royalty: newRoyalty });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// GET API to fetch royalty details by royaltyId
const getRoyaltyByIdController = async (req, res) => {
    try {
        const { royaltyId } = req.params;

        const royalty = await getRoyaltyById(royaltyId);

        if (!royalty) {
            return res.status(404).json({ message: 'Royalty not found' });
        }

        res.status(200).json(royalty);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createRoyaltyController, getRoyaltyByIdController };*/

const { createRoyalty, getRoyaltyById } = require('../services/royaltyService');
const Artist = require('../models/artistModel');
const Song = require('../models/songModel');

// ✅ Recalculate fullRoyalty for the artist
const updateArtistFullRoyalty = async (artistId) => {
  try {
    const artistSongs = await Song.find({ artistId });
    const totalStreams=artistSongs.reduce((sum, song) => sum + (song.totalStreams || 0), 0);
    const totalRoyalty = artistSongs.reduce((sum, song) => sum + (song.totalRoyalty || 0), 0);
    const totalRoyaltyPaid = artistSongs.reduce((sum, song) => sum +(song.royaltyPaid ||0),0);
    const totalRoyaltyDue = artistSongs.reduce((sum, song) => sum+(song.royaltyDue || 0), 0);
    await Artist.findOneAndUpdate({ _id: artistId }, { fullRoyalty: totalRoyalty },{ totalRoyaltyPaid: totalRoyaltyPaid },{ totalRoyaltyDue: totalRoyaltyDue },{totalStreams:totalStreams});
  } catch (error) {
    console.error("Error updating artist fullRoyalty:", error);
  }
};

// ✅ Create Royalty and update artist fullRoyalty
const createRoyaltyController = async (req, res) => {
  try {
    const { artistId, songId,artistName } = req.body;

    // const royaltyId=req.body.songName.toLowerCase().replace(/\s+/g, '-');
    const royaltyId = `${artistName}-${req.body.songName.toLowerCase().replace(/\s+/g, '-')}`;

    // Create Royalty
    const newRoyalty = await createRoyalty({ royaltyId, artistId, songId });

    // ✅ Update fullRoyalty after adding new royalty
    await updateArtistFullRoyalty(artistId);

    res.status(201).json({ message: 'Royalty created successfully', royalty: newRoyalty });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Ensure fullRoyalty updates when royalty is fetched
const getRoyaltyByIdController = async (req, res) => {
  try {
    const { royaltyId } = req.params;
    const royalty = await getRoyaltyById(royaltyId);

    if (!royalty) {
      return res.status(404).json({ message: 'Royalty not found' });
    }

    // ✅ Ensure fullRoyalty is always up to date
    await updateArtistFullRoyalty(royalty.artistId);

    res.status(200).json(royalty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createRoyaltyController, getRoyaltyByIdController };

