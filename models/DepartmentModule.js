const { DataTypes } = require('@sequelize/core')
// 将数据库连接对象导入
const sequelize = require('../config/db.config')

// 创建模型
const DepartmentModule = sequelize.define('department',{
  // 定义模型属性
  // 如果有主键，应该像如下定义
  id: {
    type: DataTypes.BIGINT,
    // 自动递增
    autoIncrement: true,
    // 是否是主键
    primaryKey: true
  },
  company_name: {
    // 字段类型
    type: DataTypes.STRING,
  },
  sort: {
    type: DataTypes.INTEGER
  },
  parent_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  status: {
    type: DataTypes.TINYINT,
  },
  createtime: {
    type: DataTypes.TIME,
  },
  path: {
    type: DataTypes.STRING
  }
},{
  freezeTableName: true, // 防止修改表名为复数
})
module.exports = DepartmentModule