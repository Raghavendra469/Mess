const Notification = require('../models/notificationModel');

const createNotification = async (notificationData) => {
  const notification = new Notification(notificationData);
  return await notification.save();
};

const getNotificationsByUser = async (userId) => {
  return await Notification.find({ userId });
};

const markNotificationAsRead = async (notificationId) => {
  // return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
  await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
  // return await Notification.findOneAndDelete(notificationId);

};

module.exports = {
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead,
};