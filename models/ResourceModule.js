const { DataTypes } = require('@sequelize/core');
// 将数据库连接对象导入
const sequelize = require('../config/db.config');

// 创建模型
const ResourceModel = sequelize.define(
  'resource',
  {
    // 定义模型属性
    // 如果有主键，应该像如下定义
    id: {
      type: DataTypes.BIGINT,
      // 自动递增
      autoIncrement: true,
      // 是否是主键
      primaryKey: true
    },
    path: {
      // 字段类型
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    sort: {
      type: DataTypes.INTEGER
    },
    component: {
      type: DataTypes.STRING
    },
    redirect: {
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING
    },
    cache: {
      type: DataTypes.TINYINT
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    affix: {
      type: DataTypes.TINYINT
    },
    breadcrumb: {
      type: DataTypes.TINYINT
    },
    hidden: {
      type: DataTypes.TINYINT
    },
    createtime: {
      type: DataTypes.TIME
    },
    permission: {
      type: DataTypes.STRING
    },
    show_parent: {
      type: DataTypes.TINYINT
    }
  },
  {
    freezeTableName: true // 防止修改表名为复数
  }
);

module.exports = ResourceModel;
