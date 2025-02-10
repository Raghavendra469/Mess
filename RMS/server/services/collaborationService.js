const Collaboration = require('../models/collaborationModel');
const Manager = require('../models/managerModel');
const Artist = require('../models/artistModel');
const Song = require('../models/songModel');
const mongoose = require('mongoose');

const createCollaboration = async (collaborationData) => {
  const collaboration = new Collaboration(collaborationData);
  
  return await collaboration.save();
};

const getCollaborationsByUserAndRole = async (userId, role) => {
  const query = role === 'Manager' ? { managerId: userId } : { artistId: userId };
  console.log(role,userId,"role","userId");
  mongoose.set('debug', true);
  return await Collaboration.find(query)
    .populate('managerId') // Populate from Manager collection
    .lean()
     .populate('artistId') // Populate from Artist collection
     .populate('songsManaged');
};

const updateCollaborationStatus = async (collaborationId, status) => {
    console.log(collaborationId,status);
    const collaboration = await Collaboration.findOne({collaborationId:collaborationId});
    console.log(collaboration,"collaboration")
    if (status === "Approved") {
      const artistId = collaboration.artistId;
      mongoose.set('debug', true);
      // Add SongId to songsManaged field in collaboration Collection
      const artistSongs = await Song.find({artistId}).select("_id")
      console.log(artistSongs,"artistSongs in collaboration")
      collaboration.songsManaged = artistSongs.map(song => song._id);
      // Add artistId to manager's managedArtists field
      await Manager.findByIdAndUpdate(
        collaboration.managerId,
        { $addToSet: { managedArtists: collaboration.artistId } }, // Prevent duplicates
        { new: true }
      );
    }
    
  return await Collaboration.findByIdAndUpdate(collaboration._id, { status }, { new: true });
};

// const collaborations = await Collaboration.find({ managerId: mongoose.Types.ObjectId(managerId) })

module.exports = {
  createCollaboration,
  getCollaborationsByUserAndRole,
  updateCollaborationStatus,
};
