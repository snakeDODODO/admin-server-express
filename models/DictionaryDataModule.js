const { DataTypes } = require('@sequelize/core');
// 将数据库连接对象导入
const sequelize = require('../config/db.config');
const DictionaryModule = require('./DictionaryModule');

// 创建模型
const DictionaryDataModule = sequelize.define(
  'dictionarydata',
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
    dictionaryname: {
      // 字段类型
      type: DataTypes.STRING
    },
    dictionaryvalue: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    dictionary_id: {
      type: DataTypes.BIGINT,
      references: {
        // 外键引用的模型
        model: DictionaryModule,
        // 外键引用模型的列名
        key: 'id'
      }
    }
  },
  {
    freezeTableName: true // 防止修改表名为复数
  }
);

DictionaryDataModule.belongsTo(DictionaryModule, { foreignKey: 'dictionary_id', as: 'data' });
DictionaryModule.hasMany(DictionaryDataModule, { foreignKey: 'dictionary_id', as: 'data' });
module.exports = DictionaryDataModule;
