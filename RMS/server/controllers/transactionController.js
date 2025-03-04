const TransactionService = require('../services/transactionService');

const transactionService=new TransactionService()
 
// Ensure all functions are defined correctly
exports.createTransaction = async (req, res) => {
  try {
    console.log(req.body,"req.body")
    const { userId, royaltyId, transactionAmount } = req.body;
    if (!userId || !royaltyId || !transactionAmount) {
      return res.status(400).json({ error: "Missing required fields: userId, royaltyId, transactionAmount" });
    }
    const transaction = await transactionService.createTransaction(req.body);
    res.status(201).json({ message: "Transaction recorded successfully", transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.userId);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 
exports.getTransactionsByUserId = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactionsByUserId(req.params.userId,req.params.role);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 
exports.deleteTransaction = async (req, res) => {
  try {
    await transactionService.deleteTransaction(req.params.id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 
exports.payArtist = async (req, res) => {
  try {
    const { transactionId, paymentAmount } = req.body;
    console.log(transactionId, paymentAmount,"*******************************");
    if (!transactionId || !paymentAmount) {
      return res.status(400).json({ error: "Missing required fields: transactionId, paymentAmount" });
    }
    const transaction = await transactionService.payArtist(transactionId, paymentAmount);
    res.status(200).json({ message: "Payment processed successfully", transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 
exports.exportTransactionsPDF = async (req, res) => {
  try {
    const { userId,role } = req.params; // Assuming transactions are user-specific
    const pdfBuffer = await transactionService.generateTransactionsPDF(userId,role);
   
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="transactions.pdf"');
   
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};