const express = require('express');
const router = express.Router();
const { createRoyaltyController, getRoyaltyByIdController,getRoyaltyByArtistIdController } = require('../controllers/royaltyController');
 
// POST route to create royalty
router.post('/', createRoyaltyController);
 
// GET route to fetch royalty details by royaltyId
router.get('/:royaltyId', getRoyaltyByIdController);
 
router.get('/artists/:artistId', getRoyaltyByArtistIdController);
 
module.exports = router;