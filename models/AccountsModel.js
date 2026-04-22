const { DataTypes } = require('@sequelize/core')
// 将数据库连接对象导入
const sequelize = require('../config/db.config')
const A_ClassModel = require('./A_ClassModel')

// 创建模型
const AccountsModel = sequelize.define('accounts',{
  // 定义模型属性
  // 如果有主键，应该像如下定义
  account_id: {
    type: DataTypes.INTEGER,
    // 自动递增
    autoIncrement: true,
    // 是否是主键
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
  },
  account_name: {
    type: DataTypes.STRING,
  },
  aclass_id: {
    type: DataTypes.INTEGER,
    references: {
      // 外键引用的模型
      model: A_ClassModel,
      // 外键引用模型的列名
      key: 'id'
    }
  },
  balance: {
    type: DataTypes.DECIMAL(10,2),
  },
  created_at: {
    type: DataTypes.TIME,
  },
},{
  freezeTableName: true, // 防止修改表名为复数
})

AccountsModel.belongsTo(A_ClassModel, { foreignKey: 'aclass_id'});
A_ClassModel.hasMany(AccountsModel, { foreignKey: 'aclass_id'});
module.exports = AccountsModel