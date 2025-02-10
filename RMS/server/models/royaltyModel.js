const mongoose = require('mongoose');
const Royalty = require('../models/royaltyModel');
const Song = require('../models/songModel');

const RoyaltySchema = new mongoose.Schema({
    royaltyId: { type: String, required: true, unique: true }, // e.g., "venu-krithik"
    artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
    songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
    period: { type: String, default: Date.now }, // e.g., "January 2025"
    totalRoyalty: { type: Number, default: 0 },
    royaltyDue: { type: Number, default: 0 },
    royaltyPaid: { type: Number, default: 0 },
    totalStreams: { type: Number, default: 0 }, // Streams counter
    calculated_date: { type: Date, default: Date.now } // Last updated timestamp
});

// module.exports = mongoose.model('Royalty', RoyaltySchema);
// Middleware to update Song.totalRoyalty whenever Royalty.totalRoyalty updates
// console.log("Royalty model is loaded");
RoyaltySchema.pre("save", async function (next) {
    console.log("💡 Middleware triggered for", this.royaltyId);
    if (this.isModified("totalRoyalty")) { // Check if totalRoyalty is changed
        console.log(`Updating totalRoyalty in Song module for song: ${this.songId}`);
      try {
        const updateResult=await Song.updateMany(
          { _id: this.songId }, // Use the formatted artistId (e.g., "venu-krithik")
          { $set: { totalRoyalty: this.totalRoyalty } }, // Sync totalRoyalty with Royalty module
          { $set: { totalStreams: this.totalStreams } }
          
        );
        console.log("Update result:", updateResult);
      } catch (error) {
        console.error("Error updating totalRoyalty in Song module:", error);
      }
    }
    next();
  });
  
//   const Royalty = mongoose.model("Royalty", royaltySchema);

module.exports = mongoose.model('Royalty', RoyaltySchema, 'Royalty');