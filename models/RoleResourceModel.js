const { DataTypes } = require('@sequelize/core');
// 将数据库连接对象导入
const sequelize = require('../config/db.config');
const RoleModel = require('./RoleModel.js');
const ResourceModel = require('./ResourceModule');

// 创建模型
const RoleResourceModel = sequelize.define(
  'role_resource',
  {
    // 定义模型属性
    // 如果有主键，应该像如下定义
    role_id: {
      type: DataTypes.BIGINT,
      // 是否是主键
      primaryKey: true,
      references: {
        // 外键引用的模型
        model: RoleModel,
        // 外键引用模型的列名
        key: 'id'
      }
    },
    resource_id: {
      type: DataTypes.BIGINT,
      // 是否是主键
      primaryKey: true,
      references: {
        // 外键引用的模型
        model: ResourceModel,
        // 外键引用模型的列名
        key: 'id'
      }
    }
  },
  {
    freezeTableName: true // 防止修改表名为复数
  }
);

module.exports = RoleResourceModel;
