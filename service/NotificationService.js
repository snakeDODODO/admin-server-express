const NotificationModel = require('../models/notificationModel');
const UserModel = require('../models/UserModel');
const MessageModel = require('../models/MessageModel');
const User_messageModel = require('../models/User_messageModel');
const { Op } = require('@sequelize/core');
const { Sequelize } = require('@sequelize/core');
const sequelize = require('../config/db.config');
const { createMessageNotice, sendNoticeToBatchUsers } = require('../utils/websocket');

const NotificationService = {
  // 获取全部消息列表
  getNotificationListAll: async () => {
    try {
      const result = await NotificationModel.findAll();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 账户类别列表获取（带参）
  getNotificationList: async ({ currentPage, pageSize, title }) => {
    try {
      // 将字符串格式的参数转换为数字类型
      currentPage = parseInt(currentPage, 10);
      pageSize = parseInt(pageSize, 10);

      // 验证转换是否成功
      if (isNaN(currentPage) || isNaN(pageSize) || currentPage <= 0 || pageSize <= 0) {
        throw new Error('传入的参数不正确，必须是正整数。');
      }
      // 定义查询条件对象 名称 编码 状态
      const whereClause = {};
      // 账户类别名称
      if (title) {
        whereClause.title = {
          [Op.like]: `${title}%`
        };
      }
      // 计算偏移量
      const offset = (currentPage - 1) * pageSize;
      const rows = await NotificationModel.findAndCountAll({
        where: whereClause,
        offset: offset,
        limit: pageSize,
        raw: true
      });
      return rows;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 添加通知
  addNotification: async notification => {
    try {
      let result = await NotificationModel.create(notification, {
        raw: true, // 返回原始数据而不是模型实例
        returning: true // 插入数据后返回那些字段（可指定，例['id']），参数可以是一个数组或者布尔值true，true返回所有字段
      });
      if (!result) return 'fail';
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 删除通知
  deleteNotification: async NotificationToDelete => {
    try {
      let result = await NotificationModel.destroy({
        where: {
          id: { [Op.in]: NotificationToDelete }
        }
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 更新通知
  updateNotification: async (id, Notification) => {
    try {
      const result = await NotificationModel.update(Notification, {
        where: { id },
        fields: ['title', 'content', 'type', 'publish_status', 'selected_users', 'effective_time', 'terminate_time'],
        raw: true
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 通知发布
  updateNotificationPublish_Status: async (id, publish_status) => {
    try {
      // 使用回调函数方式处理事务
      return await sequelize.transaction(async transaction => {
        // 1. 更新通知状态为已发布
        const notice = await NotificationModel.findByPk(id, { transaction });

        if (!notice) {
          throw new Error('通知不存在');
        }

        notice.publish_status = publish_status;
        await notice.save({ transaction });

        // 2. 获取用户ID列表（根据is_appoint决定是全部用户还是指定用户）
        let userIds = [];

        if (notice.is_appoint === 0) {
          // 发送给所有用户
          const users = await UserModel.findAll({
            attributes: ['id'],
            where: { status: 1 }, // 只发送给有效用户
            transaction
          });
          userIds = users.map(user => user.id);
        } else if (notice.is_appoint === 1 && notice.selected_users) {
          // 发送给指定用户
          userIds = notice.selected_users.split(',').map(id => parseInt(id, 10));

          // 验证用户ID是否有效
          const validUsers = await UserModel.count({
            where: {
              id: { [Op.in]: userIds },
              status: 1
            },
            transaction
          });

          if (validUsers !== userIds.length) {
            console.warn(`部分指定用户ID无效或已禁用`);
          }
        }

        if (userIds.length === 0) {
          return true; // 没有目标用户，直接返回成功
        }

        // 3. 创建消息
        const message = await MessageModel.create(
          {
            title: `公告: ${notice.title}`,
            content: notice.content,
            type: notice.type || 1, // 使用通知类型或默认为1
            notice_id: notice.id,
            create_time: Sequelize.fn('NOW'),
            create_user_id: notice.issuer_id,
            effective_time: notice.effective_time,
            terminate_time: notice.terminate_time
          },
          { transaction }
        );

        // 4. 分批处理用户消息关联（避免一次性处理过多数据）
        const BATCH_SIZE = 1000;
        for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
          const batch = userIds.slice(i, i + BATCH_SIZE);
          await User_messageModel.bulkCreate(
            batch.map(userId => ({
              user_id: userId,
              message_id: message.id,
              is_read: 0
            })),
            { transaction }
          );
        }

        // WebSocket推送消息
        sendNoticeToBatchUsers(userIds, message);

        return true;
      });
    } catch (error) {
      console.error('发布通知失败:', error);
      return Promise.reject(error);
    }
  },
  // 设置已读
  updateNotificationIs_Read: async (id, is_read) => {
    try {
      const [result] = await NotificationModel.update(
        {
          is_read
        },
        {
          where: { id },
          raw: true
        }
      );
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

module.exports = NotificationService;
