// notificationRepository.js
const Notification = require('../models/notificationModel'); // The Mongoose model

class NotificationRepository {
  // Create a new notification
  async create(notificationData) {
    const notification = new Notification(notificationData);
    return await notification.save(); // Save to DB
  }

  // Get notifications by user ID
  async findByUserId(userId) {
    return await Notification.find({ userId }); // Fetch from DB
  }

  // Mark notification as read and delete it
  async markAsReadAndDelete(notificationId) {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    await Notification.findOneAndDelete(notificationId); // Delete after marking as read
    return notification; // Return the updated notification
  }
}

module.exports = NotificationRepository;
