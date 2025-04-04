const { DataTypes } = require('@sequelize/core');
// 将数据库连接对象导入
const sequelize = require('../config/db.config');

// 创建账户类别模型
const MessageModel = sequelize.define(
  'message',
  {
    // 定义模型属性
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.TINYINT
    },
    create_time: {
      type: DataTypes.TIME
    },
    create_user_id: {
      type: DataTypes.BIGINT
    },
    notice_id: {
      type: DataTypes.BIGINT
    },
    effective_time: {
      type: DataTypes.TIME
    },
    terminate_time: {
      type: DataTypes.TIME
    }
  },
  {
    freezeTableName: true // 防止修改表名为复数
  }
);

module.exports = MessageModel;
