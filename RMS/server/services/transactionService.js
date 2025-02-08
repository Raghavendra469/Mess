const Transaction = require('../models/transaction');
const Royalty = require('../models/royaltyModel');

exports.createTransaction = async (data) => {
  const transaction = new Transaction(data);
  // Update royalty information
  const royalty = await Royalty.findById(data.royaltyId);
  royalty.totalRoyalty += data.transactionAmount;
  royalty.royaltyDue += data.transactionAmount;
  await royalty.save();
  return await transaction.save();
};

// Pay the artist and update royaltyPaid and royaltyDue
exports.payArtist = async (transactionId, paymentAmount) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw new Error("Transaction not found");
  }

  // Update the royalty fields
  const royalty = await Royalty.findById(transaction.royaltyId);

  const remainingDue = transaction.royaltyDue - paymentAmount;
  if (remainingDue < 0) {
    throw new Error("Payment exceeds the royalty due");
  }

  transaction.royaltyPaid += paymentAmount;
  transaction.royaltyDue = remainingDue;

  // Update Royalty schema (royaltyPaid and royaltyDue)
  royalty.royaltyPaid += paymentAmount;
  royalty.royaltyDue = remainingDue;
  
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
