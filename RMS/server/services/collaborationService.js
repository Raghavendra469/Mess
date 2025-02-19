const CollaborationRepository = require('../repositories/collaborationRepository');
 
class CollaborationService {
    constructor() {
        this.collaborationRepository = new CollaborationRepository();
    }
 
    async createCollaboration(collaborationData) {
        return await this.collaborationRepository.createCollaboration(collaborationData);
    }
 
    async getCollaborationsByUserAndRole(userId, role) {
        return await this.collaborationRepository.getCollaborationsByUserAndRole(userId, role);
    }
 
    // async updateCollaborationStatus(collaborationId, status) {
    //     // console.log("ststus",status)
    //     return await this.collaborationRepository.updateCollaborationStatus(collaborationId, status);
    // }

    async updateCollaborationStatus(collaborationId, status) {
        console.log('updateCollaborationStatus service')
        console.log(collaborationId, status)
   
        const collaboration = await this.collaborationRepository.findCollaborationById(collaborationId);
        if (!collaboration) throw new Error("Collaboration not found");
   
        if (status === "Approved") {
          const artistId = collaboration.artistId;
          // Fetch artist's songs
          console.log(artistId,status,"inside approved")
          // Update songs in the collaboration
          await this.collaborationRepository.updateCollaborationStatus(collaborationId, status);
   
          // Update manager's managedArtists
          await this.collaborationRepository.updateManagerManagedArtists(collaboration.managerId, artistId);
   
          // Update artist's manager reference
          await this.collaborationRepository.updateArtistManager(artistId, collaboration.managerId);
        } else {
          console.log(status,'inside reject')
          // Just update status if not "Approved"
          await this.collaborationRepository.updateCollaborationStatus(collaborationId, { status });
        }
   
        return await this.collaborationRepository.findCollaborationById(collaborationId);
      }
   
 
    async requestCancellation(collaborationId, cancellationReason) {
        return await this.collaborationRepository.requestCancellation(collaborationId, cancellationReason);
    }
 
    async handleCancellationResponse(collaborationId, decision) {
        return await this.collaborationRepository.handleCancellationResponse(collaborationId, decision);
    }
}
 
module.exports = CollaborationService;