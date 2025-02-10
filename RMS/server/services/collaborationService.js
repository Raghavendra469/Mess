const Collaboration = require('../models/collaborationModel');
const Manager = require('../models/managerModel');
const Artist = require('../models/artistModel');
const Song = require('../models/songModel');
const mongoose = require('mongoose');

const createCollaboration = async (collaborationData) => {
  console.log("collaborationData",collaborationData)
  const collaboration = new Collaboration(collaborationData);
  
  return await collaboration.save();
};

// const createCollaboration = async (collaborationData) => {
//   try {
//     const { artistId } = req.body;
 
//     // Check if the artist already has a manager
//     const artist = await Artist.findById(artistId);
//     if (!artist) {
//         return res.status(404).json({ message: "Artist not found." });
//     }
 
//     if (artist.manager) {
//         return res.status(400).json({ message: "This artist already has a manager and cannot send or receive collaboration requests." });
//     }
 
//     // Create the collaboration request
//     const collaboration = new Collaboration(collaborationData);
 
//     await collaboration.save();
//     return res.status(201).json({ message: "Collaboration request sent successfully.", collaboration });
 
// } catch (error) {
//     console.error("Error in createCollaboration:", error);
//     res.status(500).json({ message: "Server error" });
// }
  
//   return await collaboration.save();
// };
 

const getCollaborationsByUserAndRole = async (userId, role) => {
  const query = role === 'Manager' ? { managerId: userId } : { artistId: userId };

  console.log(role, userId, "role", "userId");
  mongoose.set('debug', true);

  const collaborationData = await Collaboration.find(query)
    .populate('managerId') // Populate from Manager collection
    .populate('artistId') // Populate from Artist collection
    .populate('songsManaged')
    .lean();

  // Filter only those where status is 'Pending'
  const pendingCollaborations = collaborationData.filter(collab => collab.status === 'Pending');

  // console.log("Pending Collaborations:", pendingCollaborations);

  return pendingCollaborations;
};


const updateCollaborationStatus = async (collaborationId, status) => {
    console.log(collaborationId,status);
    const collaboration = await Collaboration.findOne({_id:collaborationId});
    console.log(collaboration,"collaboration")
    if (status === "Approved") {
      const artistId = collaboration.artistId;
      mongoose.set('debug', true);
      // Add SongId to songsManaged field in collaboration Collection
      const artistSongs = await Song.find({artistId}).select("_id")
      Collaboration.songsManaged = artistSongs.map(song => song._id);
      // Add artistId to manager's managedArtists field
      await Manager.findByIdAndUpdate(
        collaboration.managerId,
        { $addToSet: { managedArtists: collaboration.artistId } }, // Prevent duplicates
        { new: true }
      );

      await Artist.findByIdAndUpdate(
        collaboration.artistId,
        { $set: { manager: collaboration.managerId}},
        {new: true }
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
