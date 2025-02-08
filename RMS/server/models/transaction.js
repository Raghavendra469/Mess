const mongoose = require('mongoose');
require('../models/royaltyModel'); // Import Royalty model
require('../models/userModel');    // Import User model

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, "userId is required"] },
  royaltyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Royalty', required: [true, "royaltyId is required"] },
  transactionAmount: { type: Number, required: [true, "transactionAmount is required"], min: [1, "Amount must be greater than zero"] },
  royaltyPaid: { type: Number, default: 0 },  // Amount paid to the artist
  royaltyDue: { type: Number, default: 0 },   // Amount pending to be paid
  transactionDate: { type: Date, default: Date.now }
});

// Pre-save logic to initialize royaltyDue as the transactionAmount
TransactionSchema.pre('save', function (next) {
  if (this.isNew) {
    this.royaltyDue = this.transactionAmount; // Set initial due amount to the transaction amount
  }
  next();
});

module.exports = mongoose.model('Transaction', TransactionSchema, 'Transaction');
