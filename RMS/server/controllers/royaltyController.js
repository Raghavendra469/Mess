const RoyaltyService = require('../services/royaltyService');
const royaltyService = new RoyaltyService();

const createRoyaltyController = async (req, res) => {
    try {
        const { artistId, songId, artistName } = req.body;
        const royaltyId = `${artistName}-${req.body.songName.toLowerCase().replace(/\s+/g, '-')}`;

        const newRoyalty = await royaltyService.createRoyalty({ royaltyId, artistId, songId });

        res.status(201).json({ message: 'Royalty created successfully', royalty: newRoyalty });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getRoyaltyByIdController = async (req, res) => {
    try {
        const { royaltyId } = req.params;
        const royalty = await royaltyService.getRoyaltyById(royaltyId);

        if (!royalty) {
            return res.status(404).json({ message: 'Royalty not found' });
        }

        res.status(200).json(royalty);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getRoyaltyByArtistIdController = async (req, res) => {
    try {
        const { artistId } = req.params;
        const royalties = await royaltyService.getRoyaltyByArtistId(artistId);
        console.log(royalties,"inside controller")

        if (!royalties || royalties.length === 0) {
            return res.status(404).json({ message: 'Royalty not found' });
        }

        res.status(200).json({ success: true, royalties });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createRoyaltyController, getRoyaltyByIdController, getRoyaltyByArtistIdController };
