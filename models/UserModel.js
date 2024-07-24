const { DataTypes } = require('@sequelize/core')
// 将数据库连接对象导入
const sequelize = require('../config/db.config')
const DepartmentModule = require('./DepartmentModule')

// 测试代码，导入对象成功
// console.log(sequelize);

// 创建模型
const UserModel = sequelize.define(
  'user',
  {
    // 定义模型属性
    // 如果有主键，应该像如下定义
    id: {
      type: DataTypes.BIGINT,
      // 自动递增
      autoIncrement: true,
      // 是否是主键
      primaryKey: true,
    },
    username: {
      // 字段类型
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.INTEGER,
    },
    createtime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    lasttime: {
      type: DataTypes.TIME,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    department_id: {
      type: DataTypes.BIGINT,
      references: {
        model: DepartmentModule,
        key: 'id'
      }
    }  
  },
  {
    // 提供操作的表名
    // tableName: 'user'
    freezeTableName: true, // 防止修改表名为复数
  }
)

UserModel.belongsTo(DepartmentModule,{foreignKey: 'department_id'});
DepartmentModule.hasMany(UserModel,{foreignKey: 'department_id'})
module.exports = UserModel
