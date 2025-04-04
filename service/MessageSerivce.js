const dayjs = require('dayjs');
const MessageModel = require('../models/MessageModel');
const User_messageModel = require('../models/User_messageModel');
const { Op } = require('@sequelize/core');

const MessageService = {
  // 获取全部消息列表（暂定调试作用）
  getMessageListAll: async () => {
    try {
      const result = await MessageModel.findAll();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 消息列表获取（带参）
  getMessageList: async (user_id, { currentPage, pageSize, title, is_read, time_comparison }) => {
    try {
      // 将字符串格式的参数转换为数字类型
      currentPage = parseInt(currentPage, 10);
      pageSize = parseInt(pageSize, 10);

      // 验证转换是否成功
      if (isNaN(currentPage) || isNaN(pageSize) || currentPage <= 0 || pageSize <= 0) {
        throw new Error('传入的参数不正确，必须是正整数。');
      }
      // 定义查询条件对象
      const whereClauseOfMessage = {};
      const whereClauseOfUser_message = {};

      // 消息状态
      if (is_read) {
        whereClauseOfUser_message.is_read = {
          [Op.eq]: is_read
        };
      }

      // 用户ID
      if (user_id) {
        whereClauseOfUser_message.user_id = {
          [Op.eq]: user_id
        };
      }

      // 消息标题
      if (title) {
        whereClauseOfMessage.title = {
          [Op.like]: `${title}%`
        };
      }

      // 有效时间
      if (time_comparison) {
        if (time_comparison === 'less_than') {
          whereClauseOfMessage.effective_time = {
            [Op.gt]: dayjs().format('YYYY-MM-DD HH:mm:ss')
          };
        } else {
          whereClauseOfMessage.effective_time = {
            [Op.lt]: dayjs().format('YYYY-MM-DD HH:mm:ss')
          };
        }
      }

      // 计算偏移量
      const offset = (currentPage - 1) * pageSize;

      const result = await User_messageModel.findAndCountAll({
        where: whereClauseOfUser_message,
        offset: offset,
        limit: pageSize,
        include: [
          {
            model: MessageModel,
            where: whereClauseOfMessage,
            attributes: ['title', 'content', 'type', 'create_time', 'create_user_id', 'terminate_time']
          }
        ],
        raw: true, // 使用原始数据格式
        nest: false // 不嵌套关联数据
      });

      // 处理结果，将嵌套的Message对象扁平化
      const flattenedRows = result.rows.map(row => {
        // 创建一个新对象，包含所有字段
        const flattenedRow = {};

        // 遍历原始对象的所有属性
        for (const key in row) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            // 如果是嵌套属性（包含 '.' 的键名）
            if (key.includes('.')) {
              // 提取属性名，去掉表名前缀
              const propertyName = key.split('.')[1];
              flattenedRow[propertyName] = row[key];
            } else {
              // 直接复制非嵌套属性
              flattenedRow[key] = row[key];
            }
          }
        }

        return flattenedRow;
      });

      // 返回扁平化后的结果
      return {
        count: result.count,
        rows: flattenedRows
      };
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 删除信息
  deleteMessage: async messageToDelete => {
    try {
      const deletedRows = await User_messageModel.destroy({
        where: {
          id: { [Op.in]: messageToDelete }
        }
      });
      return deletedRows;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 信息已读
  updateMessage: async messageToRead => {
    try {
      const updatedRows = await User_messageModel.update(
        { is_read: 1 },
        {
          where: {
            id: { [Op.in]: messageToRead }
          }
        }
      );
      return updatedRows;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 全部已读
  updateMessageAll: async user_id => {
    try {
      const updatedRows = await User_messageModel.update(
        { is_read: 1 },
        {
          where: {
            user_id
          }
        }
      );
      return updatedRows;
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

module.exports = MessageService;
