const collaborationService = require('../services/collaborationService');

const createCollaboration = async (req, res) => {
  try {
    console.log(req.body,"createCollaboration")
    console.log(req.headers,'req.headers')
    const collaboration = await collaborationService.createCollaboration(req.body);
    res.status(201).json(collaboration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCollaborationsByUserAndRole = async (req, res) => {
  try {
    const { userId, role } = req.params;
    const collaborations = await collaborationService.getCollaborationsByUserAndRole(userId, role);
    res.status(200).json(collaborations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCollaborationStatus = async (req, res) => {
  try {
    console.log("req.body",req.body)
    const { collaborationId } = req.params;
    const { status } = req.body;
    console.log("status",status)

    const collaboration = await collaborationService.updateCollaborationStatus(collaborationId, status);
    res.status(200).json(collaboration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCollaboration,
  getCollaborationsByUserAndRole,
  updateCollaborationStatus,
};
