const dashboardService = require('../services/dashboardService');

// 🎤 Get Artist Dashboard
exports.getArtistDashboard = async (req, res) => {
    try {
        const { artistId } = req.params;
        const data = await dashboardService.getArtistDashboardData(artistId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🎼 Get Manager Dashboard
exports.getManagerDashboard = async (req, res) => {
    try {
        const { managerId } = req.params;
        const data = await dashboardService.getManagerDashboardData(managerId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🎧 Get Admin Dashboard
exports.getAdminDashboard = async (req, res) => {
    try {
        const data = await dashboardService.getAdminDashboardData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
