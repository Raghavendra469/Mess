const CollaborationRepository = require('../repositories/collaborationRepository');

class CollaborationService {

  constructor() {
    this.collaborationRepository = new CollaborationRepository(); // Dependency Injection
  }

  // Create a new collaboration
  async createCollaboration(collaborationData) {
    return await this.collaborationRepository.createCollaboration(collaborationData);
  }

  // Get collaborations by user and role (manager or artist)
  async getCollaborationsByUserAndRole(userId, role) {
    return await this.collaborationRepository.getCollaborationsByUserAndRole(userId, role);
  }

  // Update collaboration status and related operations

  async updateCollaborationStatus(collaborationId, status) {
    return await this.collaborationRepository.updateCollaborationStatus(collaborationId, status);
  }
}

module.exports = CollaborationService;
