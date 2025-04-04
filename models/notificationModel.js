const { DataTypes } = require('@sequelize/core');
// 将数据库连接对象导入
const sequelize = require('../config/db.config');

// 创建账户类别模型
const NotificationModel = sequelize.define(
  'notifications',
  {
    // 定义模型属性
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    is_appoint: {
      type: DataTypes.TINYINT,
      allowNull: false
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
    is_read: {
      type: DataTypes.TINYINT
    },
    created_at: {
      type: DataTypes.TIME
    },
    issuer: {
      type: DataTypes.STRING
    },
    issuer_id: {
      type: DataTypes.BIGINT
    },
    publish_status: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    selected_users: {
      type: DataTypes.STRING
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

module.exports = NotificationModel;
