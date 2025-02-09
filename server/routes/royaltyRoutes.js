/*const express = require('express');
const router = express.Router();
const royaltyController = require('../controllers/royaltyController');

router.post('/calculate', royaltyController.calculateRoyalty);
router.get('/:artistId', royaltyController.getRoyaltyByArtist);
router.get('/report/:artistId', royaltyController.exportRoyaltyReport);

module.exports = router;


const express = require('express');
const router = express.Router();
const royaltyController = require('../controllers/royaltyController');

router.post('/calculate', royaltyController.calculateRoyalty);
router.get('/:songId', royaltyController.getRoyaltyBySongId);
router.get('/report/:songId', royaltyController.exportRoyaltyReport);

module.exports = router;*/

const express = require('express');
const router = express.Router();
const RoyaltyController = require('../controllers/royaltyController');

router.post('/calculate', RoyaltyController.calculateRoyalty);
router.get('/:royaltyId', RoyaltyController.getRoyaltyByRoyaltyId);
router.get('/export/:royaltyId', RoyaltyController.exportRoyaltyReport);

module.exports = router;




