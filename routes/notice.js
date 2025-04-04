const express = require('express');
const NoticeRouter = express.Router();
const NoticeController = require('../controller/NoticeController');

// 获取通知列表
NoticeRouter.get('/api/notice/notificationlist', NoticeController.getNotificationList);

// 添加通知
NoticeRouter.post('/api/notice/addnotification', NoticeController.addNotification);

// 删除通知
NoticeRouter.post('/api/notice/deletenotification', NoticeController.deleteNotification);

// 更新通知
NoticeRouter.put('/api/notice/updatenotification/:id', NoticeController.updateNotification);

// 更新发布状态
NoticeRouter.put('/api/notice/notificationspublish_status/:id', NoticeController.updateNotificationPublish_Status);

// 已读
NoticeRouter.put('/api/notice/notificationis_read/:id', NoticeController.updateNotificationIs_Read);

// 发送消息通知
NoticeRouter.post('/message', NoticeController.sendMessage);

// 发送任务通知
NoticeRouter.post('/task', NoticeController.sendTaskNotice);

// 广播通知
NoticeRouter.post('/broadcast', NoticeController.broadcastNotice);

// 获取用户通知列表
NoticeRouter.get('/user/:userId', NoticeController.getUserNotices);

// 标记通知为已读
NoticeRouter.put('/:noticeId/read', NoticeController.markAsRead);

module.exports = NoticeRouter;
