/*const Royalty = require('../models/Royalty');
const mongoose = require('mongoose');

// Utility function for royalty calculation
const calculateRoyalty = (streams) => {
    if (streams <= 10000) return streams * 0.002;
    if (streams <= 50000) return (10000 * 0.002) + ((streams - 10000) * 0.005);
    return (10000 * 0.002) + (40000 * 0.005) + ((streams - 50000) * 0.01);
};

// Calculate Royalty for a Song
exports.calculateRoyalty = async (req, res) => {
    try {
        const { songId, totalStreams } = req.body;
        if (!songId || !totalStreams) {
            return res.status(400).json({ message: "Missing required fields: songId and totalStreams." });
        }

        const royaltyAmount = calculateRoyalty(totalStreams);
        const newRoyalty = new Royalty({
            _id: new mongoose.Types.ObjectId(),
            songId,
            totalStreams,
            royaltyAmount
        });

        await newRoyalty.save();
        res.status(201).json({ message: "Royalty calculated successfully", data: newRoyalty });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Fetch Royalty Details by Artist
exports.getRoyaltyByArtist = async (req, res) => {
    try {
        const { artistId } = req.params;
        const royalties = await Royalty.find({ songId: new RegExp(artistId, "i") }); // Partial match for artist name

        if (royalties.length === 0) {
            return res.status(404).json({ message: "No royalty records found for this artist." });
        }

        res.status(200).json({ data: royalties });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Export Royalty Report
exports.exportRoyaltyReport = async (req, res) => {
    try {
        const { artistId } = req.params;
        const royalties = await Royalty.find({ songId: new RegExp(artistId, "i") });

        if (royalties.length === 0) {
            return res.status(404).json({ message: "No royalty records found for this artist." });
        }

        res.status(200).json({ message: "Report generated successfully", data: royalties });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const royaltyService = require('../services/royaltyService');
const mongoose = require('mongoose');

// POST: Calculate and store royalty
calculateRoyalty = async (req, res) => {
    try {
        const { songId, totalStreams } = req.body;

        if (!songId || !totalStreams) {
            return res.status(400).json({ message: "Missing required fields: songId or totalStreams." });
        }

        const newRoyalty = await royaltyService.saveRoyalty(songId, totalStreams);
        res.status(201).json({ message: "Royalty calculated successfully", data: newRoyalty });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// GET: Fetch royalties by songId
getRoyaltyBySongId = async (req, res) => {
    try {
        const { songId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(songId)) {
            return res.status(400).json({ message: "Invalid songId format." });
        }

        const royalties = await royaltyService.getRoyaltiesBySongId(songId);

        if (!royalties.length) {
            return res.status(404).json({ message: "No royalties found for this songId." });
        }

        res.status(200).json({ data: royalties });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// GET: Export royalty report by songId
exportRoyaltyReport = async (req, res) => {
    try {
        const { songId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(songId)) {
            return res.status(400).json({ message: "Invalid songId format." });
        }

        const royalties = await royaltyService.exportRoyaltyReport(songId);

        if (!royalties.length) {
            return res.status(404).json({ message: "No royalty data found for export." });
        }

        res.status(200).json({ message: "Royalty report generated successfully", data: royalties });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = {
    calculateRoyalty,
    exportRoyaltyReport,
    getRoyaltyBySongId

}*/


const RoyaltyService = require('../services/royaltyService');

// POST: Calculate and store royalty
exports.calculateRoyalty = async (req, res) => {
    try {
        const { artistName, artistId, songId, totalStreams, period } = req.body;
        console.log(req.body,"req.body")

        if (!artistName || !artistId || !songId || !totalStreams || !period) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const royalty = await RoyaltyService.calculateAndSaveRoyalty(artistName, artistId, songId, totalStreams, period);
        res.status(201).json({ message: "Royalty calculated successfully", data: royalty });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// GET: Fetch royalty details by `royaltyId`
exports.getRoyaltyByRoyaltyId = async (req, res) => {
    try {
        const { royaltyId } = req.params;

        const royalties = await RoyaltyService.getRoyaltyByRoyaltyId(royaltyId);

        if (!royalties.length) {
            return res.status(404).json({ message: "No royalties found." });
        }

        res.status(200).json({ data: royalties });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// GET: Export royalty report
exports.exportRoyaltyReport = async (req, res) => {
    try {
        const { royaltyId } = req.params;

        const royalties = await RoyaltyService.exportRoyaltyReport(royaltyId);

        if (!royalties.length) {
            return res.status(404).json({ message: "No data found for export." });
        }

        res.status(200).json({ message: "Royalty report generated successfully", data: royalties });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

