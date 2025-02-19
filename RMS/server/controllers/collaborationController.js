const { routeHandler } = require('ca-webutils/expressx');
const CollaborationService = require('../services/collaborationService');
const collaborationService= new CollaborationService();
 
const collaborationController = {
    createCollaboration: routeHandler(async ({ body }) => {
        const collaboration = await collaborationService.createCollaboration(body);
        return {
            success: true,
            collaboration
        };
    }),
 
    getCollaborationsByUserAndRole: routeHandler(async ({ params }) => {
        const { userId, role } = params;
        const collaborations = await collaborationService.getCollaborationsByUserAndRole(userId, role);
        return {
            success: true,
            collaborations
        };
    }),
 
    updateCollaborationStatus: routeHandler(async ({ params, body }) => {
        const { collaborationId } = params;
        const { status } = body;
        const collaboration = await collaborationService.updateCollaborationStatus(collaborationId, status);
        if (!collaboration) {
            throw new Error('Collaboration not found');
        }
 
        return {
            success: true,
            collaboration
        };
    })
};
 
module.exports = collaborationController;