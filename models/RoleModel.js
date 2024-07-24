const { DataTypes } = require('@sequelize/core')
// 将数据库连接对象导入
const sequelize = require('../config/db.config')

// 创建模型
const RoleModel = sequelize.define('role',{
  // 定义模型属性
  // 如果有主键，应该像如下定义
  id: {
    type: DataTypes.BIGINT,
    // 自动递增
    autoIncrement: true,
    // 是否是主键
    primaryKey: true
  },
  name: {
    // 字段类型
    type: DataTypes.STRING,
    allowNull: false 
  },
  sys_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: true
  },
  createtime: {
    type: DataTypes.TIME,
    allowNull: true
  }
},{
  freezeTableName: true, // 防止修改表名为复数
})

module.exports = RoleModel