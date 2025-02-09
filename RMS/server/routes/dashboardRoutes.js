const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/artist/:artistId', dashboardController.getArtistDashboard);
router.get('/manager/:managerId', dashboardController.getManagerDashboard);
router.get('/admin', dashboardController.getAdminDashboard);

module.exports = router;
