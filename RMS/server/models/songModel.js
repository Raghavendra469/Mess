/*
const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true}, // Generated from artistName
  artistName: { type: String, required: true },
  songId: { type: String, required: true, unique: true }, // Generated from songName
  songName: { type: String, required: true },
  title: { type: String, required: true },
  totalStreams: { type: Number, default: 0 },
  totalRoyalty: { type: Number, default: 0 }, // 🔥 New Field
  releaseDate: { type: Date, default: Date.now},
  collaborators: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to automatically generate artistId and songId
songSchema.pre('save', function (next) {
  this.artistId = this.artistName.toLowerCase().replace(/\s+/g, '-');
  this.songId = this.songName.toLowerCase().replace(/\s+/g, '-');
  next();
});


module.exports = mongoose.model('Song', songSchema, 'Song');*/


const mongoose = require('mongoose');
const Artist = require('./artistModel');

const songSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true }, // 🔗 Connected to Artist model
  artistName: { type: String, required: true },
  songId: { type: String, required: true, unique: true }, // Generated from songName
  songName: { type: String, required: true },
  totalStreams: { type: Number, default: 0 },
  totalRoyalty: { type: Number, default: 0 }, // Each song's royalty
  releaseDate: { type: Date, default: Date.now },
  collaborators: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update fullRoyalty in Artist when a song is saved or updated
songSchema.post('save', async function (doc) {
  try {
    await updateArtistRoyalty(doc.artistId);
  } catch (error) {
    console.error("❌ Error updating artist's fullRoyalty:", error);
  }
});

songSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    try {
      await updateArtistRoyalty(doc.artistId);
    } catch (error) {
      console.error("❌ Error updating artist's fullRoyalty on update:", error);
    }
  }
});

// Function to update fullRoyalty in Artist
const updateArtistRoyalty = async (artistId) => {
  const totalRoyalty = await mongoose.model('Song').aggregate([
    { $match: { artistId: new mongoose.Types.ObjectId(artistId) } },
    { $group: { _id: null, totalRoyalty: { $sum: "$totalRoyalty" } } },
    


  ]);
  const totalStreams = await mongoose.model('Song').aggregate([
    { $match: { artistId: new mongoose.Types.ObjectId(artistId) } },
    { $group: { _id: null, totalStreams: { $sum: "$totalStreams" } } }

  ]);


  const newRoyalty = totalRoyalty.length > 0 ? totalRoyalty[0].totalRoyalty : 0;
  const newStreams = totalRoyalty.length > 0 ? totalStreams[0].totalStreams : 0;

  // await Artist.findByIdAndUpdate(artistId, { fullRoyalty: newRoyalty,totalStreams: newStreams });
  // await Artist.findByIdAndUpdate(artistId, { fullStreams: newStreams });
  const updatedArtist = await Artist.findByIdAndUpdate(
    artistId,
    { $set: { fullRoyalty: newRoyalty, totalStreams: newStreams } },
    { new: true }
  );
  console.log(updatedArtist,"UpdatedArtist")



  console.log(`✅ Updated fullRoyalty for artist ${artistId}: ${newRoyalty}`);
  console.log(`✅ Updated fullStreams for artist ${artistId}: ${newStreams}`);

};

// module.exports = mongoose.model('Song', songSchema, 'Song');

module.exports =  mongoose.models.Song || mongoose.model('Song', songSchema,'Song');
