const { DataTypes } = require('@sequelize/core')
// 将数据库连接对象导入
const sequelize = require('../config/db.config')

// 创建模型
const Bill_classificationModel = sequelize.define('bill_classification',{
  // 定义模型属性
  // 如果有主键，应该像如下定义
  id: {
    type: DataTypes.INTEGER,
    // 自动递增
    autoIncrement: true,
    // 是否是主键
    primaryKey: true
  },
  classification_name: {
    // 字段类型
    type: DataTypes.STRING,
  },
  classification_icon: {
    type: DataTypes.STRING,
  },
  parent_id: {
    type: DataTypes.INTEGER,
  },
  sort: {
    type: DataTypes.INTEGER,
  },
  createtime: {
    type: DataTypes.TIME,
  },
  category_type: {
    type: DataTypes.INTEGER,
  }
},{
  freezeTableName: true, // 防止修改表名为复数
})

module.exports = Bill_classificationModel