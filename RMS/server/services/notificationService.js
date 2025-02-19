// notificationService.js
const NotificationRepository = require('../repositories/notificationRepository'); // Importing the repository

class NotificationService {
  constructor() {
    this.notificationRepository = new NotificationRepository(); // Dependency Injection
  }

  // Create a new notification
  async createNotification(notificationData) {
    // You can add any additional business logic if needed (e.g., validation)
    return await this.notificationRepository.create(notificationData);
  }

  // Get notifications for a user
  async getNotificationsByUser(userId) {
    // Add business logic if necessary
    return await this.notificationRepository.findByUserId(userId);
  }

  // Mark notification as read and delete it
  async markNotificationAsRead(notificationId) {
    // Business logic can be added here if needed
    return await this.notificationRepository.markAsReadAndDelete(notificationId);
  }
}

module.exports = NotificationService;
