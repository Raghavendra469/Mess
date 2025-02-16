const Transaction = require('../models/transaction');
const Royalty = require('../models/royaltyModel');
const Artist = require('../models/artistModel');
const Manager=require('../models/managerModel');
const User = require('../models/userModel');
const PDFDocument = require("pdfkit");
 
 
 
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
  console.log(manager,"manager inside pay")
 console.log(paymentAmount,'paymentAmount')
 console.log(manager?.commissionPercentage,'commissionPercentage')
 console.log(manager.address,'address')
 const managerObj = manager.toObject();
console.log(managerObj.commissionPercentage, "Manager Commission Percentage After toObject()");
console.log(manager['commissionPercentage'], "Manager Commission Percentage Using Bracket Notation");
  // Calculate Manager and Artist share
  const managerShare = (paymentAmount * manager.commissionPercentage) / 100;
  const artistShare = paymentAmount - managerShare;
  console.log(artistShare,'artist share')
  console.log(managerShare,'manager share')
 
  // Update transaction details
  transaction.royaltyPaid += paymentAmount;
  transaction.royaltyDue -= paymentAmount;
  transaction.managerShare=(transaction.managerShare || 0) + managerShare;
  transaction.artistShare=(transaction.artistShare || 0) + artistShare;
 
  // Update Royalty details
  royalty.royaltyPaid += paymentAmount;
  royalty.royaltyDue -= paymentAmount;
 
  // Update Manager's earnings
  manager.managerShare = (manager.managerShare || 0) + managerShare;
  await manager.save();
 
  // Update Artist's earnings
  artist.artistShare = (artist.artistShare || 0) + artistShare;
  await artist.save();
 
  transaction.status="Approved";

  await royalty.save();
  await transaction.save();
 
  return { transaction, managerShare, artistShare };
};
 
exports.createTransaction = async (data) => {
  const transaction = new Transaction(data);
  console.log(data.royaltyId,"data.royaltyID create transaction")
  // Update royalty information
  const royalty = await Royalty.findById(data.royaltyId);
  console.log(royalty,"royalty in createTransaction")
 
  // royalty.totalRoyalty -= data.transactionAmount;
  // royalty.royaltyDue -= data.transactionAmount;
  await royalty.save();
 
 
  return   await transaction.save();
};
 
 
 
 
exports.getAllTransactions = async () => {
  return await Transaction.find().populate('userId').populate('royaltyId');
};
 
exports.getTransactionById = async (id) => {
  return await Transaction.findById(id).populate('userId').populate('royaltyId');
};
 
// exports.getTransactionsByUserId = async (userId) => {
//   return await Transaction.find({ userId }).populate('royaltyId');
// };
 
exports.getTransactionsByUserId = async (userId, role) => {
  try {
    console.log('role', role,'userId', userId)
    if (role === 'artist') {
      // Fetch transactions for the artist based on userId
      const artistTransactions = await Transaction.find({ userId }).populate('royaltyId').populate('songId').populate('userId').populate({path:'userId',populate:{path:'manager'}});
      // console.log(artistTransactions,'artistTransactions');
     
      return artistTransactions;
    } else if (role === 'manager') {
      // Fetch the artist(s) linked to the manager (by checking artist's manager field)
      const artists = await Artist.find({ manager: userId });
      console.log(artists,'artists----------------')
 
 
      // Collect transactions of all the artists under this manager
      let managerTransactions = [];
      for (let artist of artists) {
        const artistTransactions = await Transaction.find({ userId: artist._id }).populate('royaltyId').populate('songId').populate('userId').populate({path:'userId',populate:{path:'manager'}});
        console.log(artistTransactions,'artistTransactions---------------------------');
       
        // Add the artist's transactions (including manager share field) to the manager's transactions
        managerTransactions = [
          ...managerTransactions,
          ...artistTransactions
        ];
      }
 
      return managerTransactions;
    } else {
      throw new Error('Invalid role');
    }
  } catch (error) {
    throw new Error(`Error fetching transactions: ${error.message}`);
  }
};
 
exports.deleteTransaction = async (id) => {
  return await Transaction.findByIdAndDelete(id);
};
 
exports.generateTransactionsPDF = async (userId, role) => {
  try {
    console.log(userId, "UserId");
 
    let transactions = [];
 
    if (role === "artist") {
      // Fetch transactions directly for the artist
      transactions = await Transaction.find({ userId: userId })
        .populate("royaltyId", "royaltyAmount artistId")
        .populate("userId", "username email");
    } else if (role === "manager") {
      // Fetch all artists under this manager
      const artists = await Artist.find({ manager: userId }).select("_id");
      if (!artists.length) throw new Error("No artists found under this manager.");
 
      const artistIds = artists.map((artist) => artist._id);
 
      // Fetch transactions for all managed artists
      transactions = await Transaction.find({ userId: { $in: artistIds } })
        .populate("royaltyId", "royaltyAmount artistId")
        .populate("userId", "username email");
    } else {
      throw new Error("Invalid role");
    }
 
    console.log(transactions, "transactions");
 
    // Fetch user details
    let userData;
    if (role === "artist") {
      userData = await Artist.findById(userId);
    } else {
      userData = await Manager.findById(userId);
    }
 
    console.log(userData, "userData");
 
    if (!transactions.length) {
      throw new Error("No transactions found for this user.");
    }
 
    const doc = new PDFDocument();
    let buffers = [];
 
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {});
 
    // Add PDF Header
    doc.fontSize(18).text("Transaction Report", { align: "center" });
    doc.moveDown();
 
    // Add User Info
    doc.fontSize(12).text(`User: ${userData.username}`, { continued: true });
    doc.text(` | Email: ${userData.email}`);
    doc.moveDown();
 
    // Table Headers
    doc.fontSize(12).text("Date", 60, doc.y, { continued: true });
    doc.text("Amount", 120, doc.y, { continued: true });
    doc.text("Royalty Paid", 180, doc.y, { continued: true });
    doc.text("Royalty Due", 240, doc.y, { continued: true });
    doc.text(role === "artist" ? "Artist Share" : "Manager Share", 300, doc.y);
 
    doc.moveDown();
 
    // Add Transactions
    transactions.forEach((txn) => {
      doc.text(new Date(txn.transactionDate).toLocaleDateString(), 50, doc.y, { continued: true });
      doc.text(`$${txn.transactionAmount.toFixed(2)}`, 90, doc.y, { continued: true });
      doc.text(`$${txn.royaltyPaid.toFixed(2)}`, 160, doc.y, { continued: true });
      doc.text(`$${txn.royaltyDue.toFixed(2)}`, 250, doc.y, { continued: true });
 
      // Dynamically display Artist or Manager share
      const share = role === "artist" ? txn.artistShare : txn.managerShare;
      doc.text(`$${share.toFixed(2)}`, 335, doc.y);
 
      doc.moveDown();
    });
 
    doc.end();
 
    return new Promise((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
};