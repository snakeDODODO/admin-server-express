const { DataTypes } = require('@sequelize/core')
// 将数据库连接对象导入
const sequelize = require('../config/db.config')

// 创建模型
const UserRoleModel = sequelize.define('user_role',{
  // 定义模型属性
  // 如果有主键，应该像如下定义
  user_id: {
    type: DataTypes.BIGINT,
    // 是否是主键
    primaryKey: true,
    // references: {
    //   // 参考模型
    //   model: UserModel,
    //   key: 'id'
    // }
  },
  role_id: {
    type: DataTypes.BIGINT,
    // 是否是主键
    primaryKey: true,
    // references: {
    //   // 参考模型
    //   model: RoleModel,
    //   // 参考模型的列名
    //   key: 'id'
    // }
  } 
},{
  freezeTableName: true, // 防止修改表名为复数
})

module.exports = UserRoleModel