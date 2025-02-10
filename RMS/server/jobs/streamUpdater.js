const Royalty = require('../models/royaltyModel');

const getRandomIncrement = () => Math.floor(Math.random() * (500 - 50 + 1)) + 50; // Random between 50-500

const updateStreams = async () => {
    try {
        const royalties = await Royalty.find();
        for (let royalty of royalties) {
            const randomIncrement = getRandomIncrement();
            royalty.totalStreams += randomIncrement;
            royalty.calculated_date = new Date();
            await royalty.save();
        }
        console.log("Streams updated successfully.");
    } catch (error) {
        console.error("Error updating streams:", error);
    }
};

// Run the update every minute
setInterval(updateStreams, 60000);
