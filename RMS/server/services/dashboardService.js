const Song = require('../models/songModel');
const Artist = require('../models/artistModel');
const Manager = require('../models/managerModel');
const Royalty = require('../models/royaltyModel');

// 🎤 Fetch Artist Dashboard Data
exports.getArtistDashboardData = async (artistId) => {
    try {
        // Get top 5 songs based on streams
        const topSongs = await Song.find({ artistId })
            .sort({ totalStreams: -1 })
            .limit(5);

        // Get total royalty and streams for the artist
        const artistRoyalty = await Royalty.aggregate([
            { $match: { artistId } },
            {
                $group: {
                    _id: null,
                    totalRoyalty: { $sum: "$totalRoyalty" },
                    totalStreams: { $sum: "$totalStreams" }
                }
            }
        ]);

        return {
            topSongs,
            totalRoyalty: artistRoyalty[0]?.totalRoyalty || 0,
            totalStreams: artistRoyalty[0]?.totalStreams || 0
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// 🎼 Fetch Manager Dashboard Data
exports.getManagerDashboardData = async (managerId) => {
    try {
        // Find all artists managed by this manager
        const managedArtists = await Artist.find({ manager: managerId })
            .select("_id fullName fullRoyalty totalRoyaltyPaid");

        // Aggregate royalty and streams per artist
        const artistStats = await Royalty.aggregate([
            { $match: { artistId: { $in: managedArtists.map(a => a._id) } } },
            {
                $group: {
                    _id: "$artistId",
                    totalRoyalty: { $sum: "$totalRoyalty" },
                    totalStreams: { $sum: "$totalStreams" }
                }
            }
        ]);

        // Merge artist details with aggregated stats
        const artistData = managedArtists.map(artist => {
            const stats = artistStats.find(s => s._id.toString() === artist._id.toString()) || {};
            return {
                artistId: artist._id,
                fullName: artist.fullName,
                totalRoyalty: stats.totalRoyalty || 0,
                totalStreams: stats.totalStreams || 0
            };
        });

        return { topArtists: artistData };
    } catch (error) {
        throw new Error(error.message);
    }
};

// 🎧 Fetch Admin Dashboard Data
exports.getAdminDashboardData = async () => {
    try {
        // Get top 5 artists by total royalty
        const topArtists = await Artist.find()
            .sort({ fullRoyalty: -1 })
            .limit(5)
            .select("_id fullName fullRoyalty totalRoyaltyPaid");

        // 🔥 FIXED: Correctly aggregate managers based on artist royalties
        const topManagers = await Manager.aggregate([
            {
                $lookup: {
                    from: "artists", 
                    localField: "_id",
                    foreignField: "manager",
                    as: "managedArtists"
                }
            },
            {
                $unwind: { 
                    path: "$managedArtists", 
                    preserveNullAndEmptyArrays: true 
                }
            },
            {
                $lookup: {
                    from: "royalties", 
                    localField: "managedArtists._id",
                    foreignField: "artistId",
                    as: "royaltyData"
                }
            },
            {
                $unwind: { 
                    path: "$royaltyData", 
                    preserveNullAndEmptyArrays: true 
                }
            },
            {
                $group: {
                    _id: "$_id",
                    fullName: { $first: "$fullName" },
                    totalRoyalty: { $sum: { $ifNull: ["$royaltyData.totalRoyalty", 0] } },
                    totalStreams: { $sum: { $ifNull: ["$royaltyData.totalStreams", 0] } }
                }
            },
            { $sort: { totalRoyalty: -1 } },
            { $limit: 5 }
        ]);

        return { topArtists, topManagers };
    } catch (error) {
        throw new Error(error.message);
    }
};

