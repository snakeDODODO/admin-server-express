const { DataTypes } = require('@sequelize/core');
// 将数据库连接对象导入
const sequelize = require('../config/db.config');
const MessageModule = require('./MessageModel');
const UserModel = require('./UserModel');

// 创建用户消息关联模型
const User_messageModel = sequelize.define(
  'user_message',
  {
    // 定义模型属性
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id'
      }
    },
    message_id: {
      type: DataTypes.BIGINT,
      references: {
        model: MessageModule,
        key: 'id'
      }
    },
    is_read: {
      type: DataTypes.TINYINT
    },
    read_time: {
      type: DataTypes.TIME
    }
  },
  {
    freezeTableName: true // 防止修改表名为复数
  }
);

// 用户与消息的多对多关系 - 修正外键名称与模型定义一致
UserModel.belongsToMany(MessageModule, {
  through: User_messageModel,
  foreignKey: 'user_id', // 修改为与模型定义一致  键名必须与模型定义一致
  otherKey: 'message_id' // 明确指定另一个外键
});

MessageModule.belongsToMany(UserModel, {
  through: User_messageModel,
  foreignKey: 'message_id', // 修改为与模型定义一致
  otherKey: 'user_id' // 明确指定另一个外键
});

module.exports = User_messageModel;
