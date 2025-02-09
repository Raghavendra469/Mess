const express = require('express');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

// Create a new notification
router.post('/', notificationController.createNotification);

// Get all notifications for a user
router.get('/:userId', notificationController.getNotificationsByUser);

// Mark a notification as read
router.put('/:notificationId', notificationController.markAsRead);

module.exports = router;
