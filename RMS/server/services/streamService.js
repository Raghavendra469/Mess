const Royalty = require('../models/royaltyModel');
const Song = require('../models/songModel');  // Import the Song model
const { calculateRoyaltyForStreams } = require('./royaltyCalculationService');

// Function to generate random streams and update the database
const generateRandomStreams = async () => {
    try {
        const royalties = await Royalty.find();

        if (!royalties.length) {
        
            return;
        }

        for (let royalty of royalties) {
            const randomStreams = Math.floor(Math.random() * 1000); // Random streams between 0 and 1000
            royalty.totalStreams += randomStreams; // Increment totalStreams in Royalty

            // Recalculate royalty
            const updatedRoyalty = calculateRoyaltyForStreams(royalty);
       

            // Save updated royalty record
            await updatedRoyalty.save();

      

            // **Update the corresponding Song record**
            await Song.findOneAndUpdate(
                { _id: royalty.songId },  // Match the songId from Royalty
                { $inc: { totalStreams: randomStreams } }, // Increment song's totalStreams
                { new: true }
            );

         
        }
    } catch (error) {
        console.error('Error generating random streams:', error.message);
    }
};

module.exports = { generateRandomStreams };
