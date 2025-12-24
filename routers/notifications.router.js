const express = require('express');
const {
  getAllNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  sendPromotionNoti
} = require('../controllers/notifications.controllers.js');

const notificationsRouter = express.Router();

notificationsRouter.get('/', getAllNotifications);
notificationsRouter.get('/unread-count', getUnreadCount);
notificationsRouter.post('/mark-as-read', markAsRead);
notificationsRouter.post('/mark-all-read', markAllAsRead);
notificationsRouter.post('/send-pro-noti', sendPromotionNoti);

module.exports = { notificationsRouter };
