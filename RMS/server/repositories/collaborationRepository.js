const Collaboration = require('../models/collaborationModel');
const Manager = require('../models/managerModel');
const Artist = require('../models/artistModel');
const Song = require('../models/songModel');
const mongoose = require('mongoose');

class CollaborationRepository {
  // Create a new collaboration
  async createCollaboration(collaborationData) {
    const collaboration = new Collaboration(collaborationData);
    return await collaboration.save();
  }

  // Get collaborations by user and role (manager or artist)
  async getCollaborationsByUserAndRole(userId, role) {
    const query = role === 'Manager' ? { managerId: userId } : { artistId: userId };
    mongoose.set('debug', true);

    const collaborationData = await Collaboration.find(query)
      .populate('managerId') 
      .populate('artistId') 
      .populate('songsManaged')
      .lean();

    // Filter only those where status is 'Pending'
    const pendingCollaborations = collaborationData.filter(collab => collab.status === 'Pending');

    return pendingCollaborations;
  }

  // Update collaboration status and add songs and manage artists accordingly
  async updateCollaborationStatus(collaborationId, status) {
    const collaboration = await Collaboration.findOne({ _id: collaborationId });

    if (status === "Approved") {
      const artistId = collaboration.artistId;
      mongoose.set('debug', true);

      // Add SongId to songsManaged field in collaboration Collection
      const artistSongs = await Song.find({ artistId }).select("_id");
      collaboration.songsManaged = artistSongs.map(song => song._id);

      // Add artistId to manager's managedArtists field
      await Manager.findByIdAndUpdate(
        collaboration.managerId,
        { $addToSet: { managedArtists: collaboration.artistId } },
        { new: true }
      );

      await Artist.findByIdAndUpdate(
        collaboration.artistId,
        { $set: { manager: collaboration.managerId } },
        { new: true }
      );
    }

    return await Collaboration.findByIdAndUpdate(collaboration._id, { status }, { new: true });
  }
}

module.exports = CollaborationRepository;
