const express = require('express');
const router = express.Router();
const collaborationController = require('../controllers/collaborationController');

router.post('/', collaborationController.createCollaboration);

router.get('/:userId/:role', collaborationController.getCollaborationsByUserAndRole);

router.put('/:collaborationId', collaborationController.updateCollaborationStatus);

module.exports = router;
