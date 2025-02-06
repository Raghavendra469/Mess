/*const mongoose = require('mongoose');

const RoyaltySchema = new mongoose.Schema({
    songId: { type: String, required: true }, // Using song name as ID
    calculatedDate: { type: Date, required: true, default: Date.now },
    totalStreams: { type: Number, required: true },
    royaltyAmount: { type: Number, required: true }
});

module.exports = mongoose.model('Royalty', RoyaltySchema, 'Royalty');



const mongoose = require('mongoose');

const RoyaltySchema = new mongoose.Schema({
    songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
    calculatedDate: { type: Date, required: true },
    totalStreams: { type: Number, required: true },
    royaltyAmount: { type: Number, required: true }
});

module.exports = mongoose.model('Royalty', RoyaltySchema,'Royalty');*/



const mongoose = require('mongoose');

const RoyaltySchema = new mongoose.Schema({
    royaltyId: { type: String, required: true, unique: true }, // e.g., "venu-krithik"
    artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
    songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
    amount: { type: Number, required: true }, 
    period: { type: String, required: true }, 
    totalRoyalty: { type: Number, default: 0 }, 
    royaltyDue: { type: Number, default: 0 },   
    royaltyPaid: { type: Number, default: 0 }   
});

module.exports = mongoose.model('Royalty', RoyaltySchema, 'Royalty');


