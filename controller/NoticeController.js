const ApiResult = require('../utils/ApiResult');
const { sendNoticeToUser, broadcastNotice, createMessageNotice, createTaskNotice } = require('../utils/websocket');
const moment = require('moment');
const NotificationService = require('../service/NotificationService');

// 模拟数据存储
const notices = [];

const NoticeController = {
  //  获取通知列表
  getNotificationList: async (req, res, next) => {
    try {
      let result = await NotificationService.getNotificationList(req.query);
      if (!result) {
        res.send(ApiResult.Fail(400, '通知列表获取失败'));
      } else {
        res.send(ApiResult.Success(200, '通知列表获取成功', result));
      }
    } catch (error) {
      next(error);
    }
  },
  // 添加通知
  addNotification: async (req, res, next) => {
    try {
      let result = await NotificationService.addNotification(req.body);
      if (!result) {
        res.send(ApiResult.Fail(400, '添加通知失败'));
      } else {
        res.send(ApiResult.Success(200, '添加通知成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  },
  // 删除通知
  deleteNotification: async (req, res, next) => {
    try {
      let result = await NotificationService.deleteNotification(req.body);
      if (!result) {
        res.send(ApiResult.Fail(400, '删除通知失败'));
      } else {
        res.send(ApiResult.Success(200, '删除通知成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  },
  // 更新通知
  updateNotification: async (req, res, next) => {
    try {
      let result = await NotificationService.updateNotification(req.params.id, req.body);
      if (!result) {
        res.send(ApiResult.Fail(400, '更新通知失败'));
      } else {
        res.send(ApiResult.Success(200, '更新通知成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  },
  // 修改通知发布状态
  updateNotificationPublish_Status: async (req, res, next) => {
    try {
      const result = await NotificationService.updateNotificationPublish_Status(req.params.id, req.body.publish_status);
      if (!result) {
        res.send(ApiResult.Fail(400, '状态修改失败'));
      } else {
        res.send(ApiResult.Success(200, '状态修改成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  },
  // 通知已读
  updateNotificationIs_Read: async (req, res, next) => {
    try {
      const result = await NotificationService.updateNotificationIs_Read(req.params.id, req.body.is_read);
      // 通知发布逻辑
      if (!result) {
        res.send(ApiResult.Fail(400, '已读状态更新失败'));
      } else {
        res.send(ApiResult.Success(200, '已读状态更新成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  },
  // 发送消息通知
  sendMessage: async (req, res, next) => {
    try {
      const { userId, title, content, sender } = req.body;

      if (!userId || !title || !content) {
        return res.send(ApiResult.Fail(400, '缺少必要参数'));
      }

      // 创建消息通知
      const notice = createMessageNotice(userId, title, content, sender);

      // 存储通知
      notices.push(notice);

      // 发送通知
      const sent = sendNoticeToUser(userId, notice);

      if (sent) {
        res.send(ApiResult.Success(200, '消息发送成功', notice));
      } else {
        res.send(ApiResult.Success(200, '消息已保存，但用户不在线', notice));
      }
    } catch (error) {
      next(error);
    }
  },

  // 发送任务通知
  sendTaskNotice: async (req, res, next) => {
    try {
      const { userId, title, content, status, startTime, endTime } = req.body;

      if (!userId || !title || !content || !status) {
        return res.send(ApiResult.Fail(400, '缺少必要参数'));
      }

      // 验证状态值
      const validStatuses = ['not_started', 'in_progress', 'completed', 'expired'];
      if (!validStatuses.includes(status)) {
        return res.send(ApiResult.Fail(400, '无效的状态值'));
      }

      // 创建任务通知
      const notice = createTaskNotice(userId, title, content, status, startTime, endTime);

      // 存储通知
      notices.push(notice);

      // 发送通知
      const sent = sendNoticeToUser(userId, notice);

      if (sent) {
        res.send(ApiResult.Success(200, '任务通知发送成功', notice));
      } else {
        res.send(ApiResult.Success(200, '任务通知已保存，但用户不在线', notice));
      }
    } catch (error) {
      next(error);
    }
  },

  // 广播通知给所有用户
  broadcastNotice: async (req, res, next) => {
    try {
      const { title, content, type } = req.body;

      if (!title || !content || !type) {
        return res.send(ApiResult.Fail(400, '缺少必要参数'));
      }

      // 创建广播通知
      const notice = {
        type: type === 'message' ? 'message' : 'task',
        id: uuidv4(),
        title,
        content,
        timestamp: new Date().toISOString(),
        broadcast: true
      };

      // 存储通知
      notices.push(notice);

      // 广播通知
      broadcastNotice(notice);

      res.send(ApiResult.Success(200, '广播通知发送成功', notice));
    } catch (error) {
      next(error);
    }
  },

  // 获取用户的通知列表
  getUserNotices: async (req, res, next) => {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return res.send(ApiResult.Fail(400, '缺少用户ID'));
      }

      // 获取用户的通知
      const userNotices = notices.filter(notice => notice.userId === userId || notice.broadcast === true);

      res.send(ApiResult.Success(200, '获取通知列表成功', userNotices));
    } catch (error) {
      next(error);
    }
  },

  // 标记通知为已读
  markAsRead: async (req, res, next) => {
    try {
      const { noticeId } = req.params;

      if (!noticeId) {
        return res.send(ApiResult.Fail(400, '缺少通知ID'));
      }

      // 查找并标记通知
      const notice = notices.find(n => n.id === noticeId);

      if (!notice) {
        return res.send(ApiResult.Fail(404, '通知不存在'));
      }

      notice.read = true;

      res.send(ApiResult.Success(200, '标记通知为已读成功', notice));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = NoticeController;
