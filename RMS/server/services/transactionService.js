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
      transactions = await Transaction.find({ userId: userId })
        .populate("royaltyId", "royaltyAmount artistId songId")
        .populate("userId", "username email")
        .populate("songId", "songName");
    } else if (role === "manager") {
      const artists = await Artist.find({ manager: userId }).select("_id");
      if (!artists.length) throw new Error("No artists found under this manager.");
 
      const artistIds = artists.map((artist) => artist._id);
 
      transactions = await Transaction.find({ userId: { $in: artistIds } })
        .populate("royaltyId", "royaltyAmount artistId songId")
        .populate("userId", "username email")
        .populate("songId", "songName");
    } else {
      throw new Error("Invalid role");
    }
 
    console.log(transactions, "transactions");
 
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
 
    const doc = new PDFDocument({
      margin: 50,
      size: 'A4'
    });
   
    let buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
 
    // Define column widths and positions
    const columns = {
      date: { x: 50, width: 80 },
      songName: { x: 130, width: 180 },
      amount: { x: 310, width: 80 },
      royalty: { x: 390, width: 80 },
      share: { x: 470, width: 80 }
    };
 
    // Helper function to truncate text
    const truncateText = (text, width) => {
      if (!text) return 'N/A';
      if (doc.widthOfString(text) <= width) return text;
      let truncated = text;
      while (doc.widthOfString(truncated + '...') > width && truncated.length > 0) {
        truncated = truncated.slice(0, -1);
      }
      return truncated + '...';
    };
 
    // Helper function to draw a row with proper text alignment
    const drawRow = (items, isHeader = false) => {
      const y = doc.y;
      const textOptions = { width: 0, align: 'left' };
     
      if (isHeader) {
        doc.font('Helvetica-Bold');
      } else {
        doc.font('Helvetica');
      }
 
      // Date
      doc.text(items.date, columns.date.x, y, {
        ...textOptions,
        width: columns.date.width
      });
 
      // Song Name
      doc.text(
        truncateText(items.songName, columns.songName.width),
        columns.songName.x,
        y,
        {
          ...textOptions,
          width: columns.songName.width
        }
      );
 
      // Amount
      doc.text(items.amount, columns.amount.x, y, {
        ...textOptions,
        width: columns.amount.width,
        align: 'right'
      });
 
      // Royalty
      doc.text(items.royalty, columns.royalty.x, y, {
        ...textOptions,
        width: columns.royalty.width,
        align: 'right'
      });
 
      // Share
      doc.text(items.share, columns.share.x, y, {
        ...textOptions,
        width: columns.share.width,
        align: 'right'
      });
 
      doc.moveDown();
    };
 
    // PDF Header
    doc.fontSize(18)
      .font('Helvetica-Bold')
      .text("Transaction Report", { align: "center" });
    doc.moveDown();
 
    // User Info
    doc.fontSize(12)
      .font('Helvetica')
      .text(`User: ${userData.username} | Email: ${userData.email}`);
    doc.moveDown();
 
    // Draw header row
    doc.fontSize(10);
    drawRow(
      {
        date: "Date",
        songName: "Song Name",
        amount: "Amount",
        royalty: "Royalty Paid",
        share: role === "artist" ? "Artist Share" : "Manager Share"
      },
      true
    );
 
    // Draw divider line
    doc.moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();
    doc.moveDown(0.5);
 
    // Calculate totals while adding transactions
    let totalAmount = 0;
    let totalRoyalty = 0;
    let totalShare = 0;
 
    // Add Transactions
    transactions.forEach((txn) => {
      totalAmount += txn.transactionAmount;
      totalRoyalty += txn.royaltyPaid;
      totalShare += role === "artist" ? txn.artistShare : txn.managerShare;
 
      drawRow({
        date: new Date(txn.transactionDate).toLocaleDateString(),
        songName: txn.songId ? txn.songId.songName : "Unknown",
        amount: `$${txn.transactionAmount.toFixed(2)}`,
        royalty: `$${txn.royaltyPaid.toFixed(2)}`,
        share: `$${(role === "artist" ? txn.artistShare : txn.managerShare).toFixed(2)}`
      });
    });
 
    // Add a divider line before totals
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();
    doc.moveDown(0.5);
 
    // Add totals row
    doc.font('Helvetica-Bold').fontSize(10);
    drawRow({
      date: "",
      songName: "Total",
      amount: `$${totalAmount.toFixed(2)}`,
      royalty: `$${totalRoyalty.toFixed(2)}`,
      share: `$${totalShare.toFixed(2)}`
    }, true);
 
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