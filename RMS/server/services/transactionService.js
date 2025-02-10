const Transaction = require('../models/transaction');
const Royalty = require('../models/royaltyModel');
const Artist = require('../models/artistModel');
const Manager = require('../models/managerModel');

exports.payArtist = async (transactionId, paymentAmount) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw new Error("Transaction not found");
  }

  // Get the Royalty record
  const royalty = await Royalty.findById(transaction.royaltyId);
  if (!royalty) {
    throw new Error("Royalty record not found");
  }

  // Validate payment amount
  if (paymentAmount > royalty.royaltyDue) {
    throw new Error("Payment exceeds the royalty due");
  }

  // Get the Artist who owns the Royalty
  const artist = await Artist.findById(royalty.artistId);
  if (!artist) {
    throw new Error("Artist not found");
  }

  // Get the Manager of the Artist
  const manager = await Manager.findById(artist.manager);
  if (!manager) {
    throw new Error("Manager not found");
  }

  // Set default manager percentage if not found
  const managerPercentage = manager.managerPercentage || 10;
  const managerShare = (paymentAmount * managerPercentage) / 100;
  const artistShare = paymentAmount - managerShare;

  // First, update the Royalty schema
  royalty.royaltyPaid += paymentAmount;
  royalty.royaltyDue -= paymentAmount;
  await royalty.save();

  // Then, update the Transaction schema
  transaction.royaltyPaid += paymentAmount;
  transaction.royaltyDue -= paymentAmount;
  await transaction.save();

  // Update Manager's earnings
  manager.managerShare = (manager.managerShare || 0) + managerShare;
  await manager.save();

  // Update Artist's earnings
  artist.royaltyEarnings = (artist.royaltyEarnings || 0) + artistShare;
  await artist.save();

  return {
    success: true,
    message: "Payment processed successfully",
    transaction,
    artistShare,
    managerShare
  };
};

exports.createTransaction = async (data) => {
  const transaction = new Transaction(data);

  // Update royalty information
  const royalty = await Royalty.findById(data.royaltyId);
  if (!royalty) {
    throw new Error("Royalty not found");
  }

  royalty.totalRoyalty += data.transactionAmount;
  royalty.royaltyDue += data.transactionAmount;
  await royalty.save();
  await transaction.save();

  return transaction;
};

exports.getAllTransactions = async () => {
  return await Transaction.find().populate('userId').populate('royaltyId');
};

exports.getTransactionById = async (id) => {
  return await Transaction.findById(id).populate('userId').populate('royaltyId');
};

exports.getTransactionsByUserId = async (userId) => {
  return await Transaction.find({ userId }).populate('royaltyId');
};

exports.deleteTransaction = async (id) => {
  return await Transaction.findByIdAndDelete(id);
};
