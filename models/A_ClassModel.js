const { DataTypes } = require('@sequelize/core')
// 将数据库连接对象导入
const sequelize = require('../config/db.config')

// 创建账户类别模型
const A_ClassModel = sequelize.define('a_class',{
  // 定义模型属性
  // 如果有主键，应该像如下定义
  id: {
    type: DataTypes.INTEGER,
    // 自动递增
    autoIncrement: true,
    // 是否是主键
    primaryKey: true
  },
  a_class: {
    type: DataTypes.STRING,
  },
  a_icon: {
    type: DataTypes.STRING,
  },
  a_creatime: {
    type: DataTypes.TIME,
  },
},{
  freezeTableName: true, // 防止修改表名为复数
})

module.exports = A_ClassModel