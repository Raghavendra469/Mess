const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController'); // Ensure correct import path

// Define your routes here and associate them with controller functions
router.post('/', transactionController.createTransaction);   // Ensure controller is defined and imported
router.get('/', transactionController.getAllTransactions);  // Ensure controller is defined and imported
router.get('/:id', transactionController.getTransactionById); // Ensure controller is defined and imported
router.get('/user/:role/:userId', transactionController.getTransactionsByUserId); // Ensure controller is defined and imported
router.delete('/:id', transactionController.deleteTransaction); // Ensure controller is defined and imported

// Handle payment route
router.post('/pay', transactionController.payArtist); // Ensure controller is defined and imported
router.get("/export/:role/:userId", transactionController.exportTransactionsPDF);


module.exports = router;