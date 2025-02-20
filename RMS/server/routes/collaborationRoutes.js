const express = require('express');
const router = express.Router();
const collaborationController = require('../controllers/collaborationController');
 
router.post('/', collaborationController.createCollaboration);
 
router.get('/:userId/:role', collaborationController.getCollaborationsByUserAndRole);
 
router.put('/:collaborationId', collaborationController.updateCollaborationStatus);
 
router.put('/:collaborationId/cancel', collaborationController.cancelCollaboration);
 
router.put('/:collaborationId/cancel-response', collaborationController.handleCancellationResponse);
 
 
module.exports = router;