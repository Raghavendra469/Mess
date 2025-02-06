/*const Royalty = require('../models/Royalty');
const mongoose = require('mongoose');

// Utility function for royalty calculation
const calculateRoyalty = (streams) => {
    if (streams <= 10000) return streams * 0.002;
    if (streams <= 50000) return (10000 * 0.002) + ((streams - 10000) * 0.005);
    return (10000 * 0.002) + (40000 * 0.005) + ((streams - 50000) * 0.01);
};

// Function to save calculated royalty to the database
const saveRoyalty = async (songId, totalStreams) => {
    const royaltyAmount = calculateRoyalty(totalStreams);
    const newRoyalty = new Royalty({
        _id: new mongoose.Types.ObjectId(),
        songId: new mongoose.Types.ObjectId(songId), // Ensure ObjectId format
        calculatedDate: new Date(),
        totalStreams,
        royaltyAmount
    });

    return await newRoyalty.save();
};

// Function to fetch royalties by songId
const getRoyaltiesBySongId = async (songId) => {
    return await Royalty.find({ songId });
};

// Function to export royalties by songId (same as getRoyalties)
const exportRoyaltyReport = async (songId) => {
    return await Royalty.find({ songId });
};

module.exports = {
    saveRoyalty,
    getRoyaltiesBySongId,
    exportRoyaltyReport
};*/


const Royalty = require('../models/Royalty');

// Generate `royaltyId` from artist name (e.g., "Venu Krithik" → "venu-krithik")
const generateRoyaltyId = (artistName) => {
    return artistName.toLowerCase().replace(/\s+/g, '-');
};

// Calculate royalty amount based on streams
const calculateRoyaltyAmount = (streams) => {
    if (streams <= 10000) return streams * 0.002;
    if (streams <= 50000) return (10000 * 0.002) + ((streams - 10000) * 0.005);
    return (10000 * 0.002) + (40000 * 0.005) + ((streams - 50000) * 0.01);
};

// Store calculated royalty in the database
const calculateAndSaveRoyalty = async (artistName, artistId, songId, totalStreams, period) => {
    const royaltyId = generateRoyaltyId(artistName);
    const royaltyAmount = calculateRoyaltyAmount(totalStreams);

    let royalty = await Royalty.findOne({ royaltyId, period });

    if (royalty) {
        royalty.totalRoyalty += royaltyAmount;
        royalty.royaltyDue += royaltyAmount;
    } else {
        royalty = new Royalty({
            royaltyId,
            artistId,
            songId,
            amount: royaltyAmount,
            period,
            totalRoyalty: royaltyAmount,
            royaltyDue: royaltyAmount,
            royaltyPaid: 0
        });
    }

    await royalty.save();
    return royalty;
};

// Get royalty details by `royaltyId`
const getRoyaltyByRoyaltyId = async (royaltyId) => {
    return await Royalty.find({ royaltyId });
};

// Export royalty report
const exportRoyaltyReport = async (royaltyId) => {
    return await Royalty.find({ royaltyId });
};

module.exports = { calculateAndSaveRoyalty, getRoyaltyByRoyaltyId, exportRoyaltyReport };

