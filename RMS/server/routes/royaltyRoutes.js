const express = require('express');
const router = express.Router();
const { createRoyaltyController, getRoyaltyByIdController } = require('../controllers/royaltyController');

// POST route to create royalty
router.post('/royalties', createRoyaltyController);

// GET route to fetch royalty details by royaltyId
router.get('/royalties/:royaltyId', getRoyaltyByIdController);

module.exports = router;