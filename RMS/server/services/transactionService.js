const Transaction = require('../models/transaction');
const Royalty = require('../models/royaltyModel');
const Artist = require('../models/artistModel');
const Manager=require('../models/managerModel');



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
 
  // Calculate Manager and Artist share
  const managerShare = (paymentAmount * manager.managerPercentage) / 100;
  const artistShare = paymentAmount - managerShare;
 
  // Update transaction details
  transaction.royaltyPaid += paymentAmount;
  transaction.royaltyDue -= paymentAmount;
 
  // Update Royalty details
  royalty.royaltyPaid += paymentAmount;
  royalty.royaltyDue -= paymentAmount;
 
  // Update Manager's earnings
  manager.managerShare = (manager.managerShare || 0) + managerShare;
  await manager.save();
 
  // Update Artist's earnings
  artist.royaltyEarnings = (artist.royaltyEarnings || 0) + artistShare;
  await artist.save();
 
  await royalty.save();
  await transaction.save();
 
  return { transaction, managerShare, artistShare };
};

exports.createTransaction = async (data) => {
  const transaction = new Transaction(data);
  // Update royalty information
  const royalty = await Royalty.findById(data.royaltyId);
  royalty.totalRoyalty += data.transactionAmount;
  royalty.royaltyDue += data.transactionAmount;
  await royalty.save();
  await transaction.save();

  return await payArtist(transaction._id,data.transactionAmount)
};

// Pay the artist and update royaltyPaid and royaltyDue
// exports.payArtist = async (transactionId, paymentAmount) => {
//   const transaction = await Transaction.findById(transactionId);
//   if (!transaction) {
//     throw new Error("Transaction not found");
//   }

//   // Update the royalty fields
//   const royalty = await Royalty.findById(transaction.royaltyId);

//   const remainingDue = transaction.royaltyDue - paymentAmount;
//   if (remainingDue < 0) {
//     throw new Error("Payment exceeds the royalty due");
//   }

//   transaction.royaltyPaid += paymentAmount;
//   transaction.royaltyDue = remainingDue;

//   // Update Royalty schema (royaltyPaid and royaltyDue)
//   royalty.royaltyPaid += paymentAmount;
//   royalty.royaltyDue = remainingDue;
  
//   await royalty.save();
//   await transaction.save();

//   return transaction;
// };



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
