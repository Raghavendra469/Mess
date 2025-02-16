const Royalty = require('../models/royaltyModel');
 
// Create a new royalty
const createRoyalty = async ({ royaltyId, artistId, songId}) => {
    const royalty = new Royalty({
        royaltyId,
        artistId,
        songId
    });
    // console.log("before save")
 
    await royalty.save();
    // console.log("🟢 After saving, should trigger middleware");
    return royalty;
};
 
// Get royalty by ID
const getRoyaltyById = async (royaltyId) => {
    return await Royalty.findOne({ royaltyId });
};
 
const getRoyaltyByArtistId = async (artistId) => {
    return await Royalty.find({ artistId:artistId }).populate('artistId').populate('songId');
};
 
 
module.exports = { createRoyalty, getRoyaltyById, getRoyaltyByArtistId};