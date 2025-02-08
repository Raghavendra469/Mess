const { createRoyalty, getRoyaltyById } = require('../services/royaltyService');

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

module.exports = { createRoyaltyController, getRoyaltyByIdController };
