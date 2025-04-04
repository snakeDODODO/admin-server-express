const { DataTypes } = require('@sequelize/core');
// 将数据库连接对象导入
const sequelize = require('../config/db.config');
const RoleModel = require('./RoleModel.js');

// 创建模型
const UserRoleModel = sequelize.define(
  'user_role',
  {
    // 定义模型属性
    // 如果有主键，应该像如下定义
    user_id: {
      type: DataTypes.BIGINT,
      // 是否是主键
      primaryKey: true
      // references: {
      //   // 参考模型
      //   model: UserModel,
      //   key: 'id'
      // }
    },
    role_id: {
      type: DataTypes.BIGINT,
      // 是否是主键
      primaryKey: true
      // 此处用来联表查询ID对应的角色名称，由于方案废弃，暂时不需要
      // references: {
      //   // 参考模型
      //   model: RoleModel,
      //   // 参考模型的列名
      //   key: 'id'
      // }
    }
  },
  {
    freezeTableName: true // 防止修改表名为复数
  }
);
// 此处用来联表查询ID对应的角色名称，由于方案废弃，暂时不需要
UserRoleModel.belongsTo(RoleModel, { foreignKey: 'role_id' });
RoleModel.hasMany(UserRoleModel, { foreignKey: 'role_id' });

module.exports = UserRoleModel;
