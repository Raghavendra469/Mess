const notificationService = require('../services/notificationService');

const createNotification = async (req, res) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    console.log(notification)
    res.status(201).json({success:true, notification});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await notificationService.getNotificationsByUser(userId);
    // console.log("user notifications",notifications)
    res.status(200).json({success:true, notifications});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await notificationService.markNotificationAsRead(notificationId);
    res.status(200).json({success:true, notification});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createNotification,
  getNotificationsByUser,
  markAsRead,
};