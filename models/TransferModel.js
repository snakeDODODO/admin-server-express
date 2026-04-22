const { DataTypes } = require('@sequelize/core');
// 将数据库连接对象导入
const sequelize = require('../config/db.config');
const Account_BookModel = require('./Account_BookModel');
const AccountsModel = require('./AccountsModel');
const UserModel = require('./UserModel');

// 报销
const TransferModel = sequelize.define(
  'transfer',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    icon_name: {
      type: DataTypes.STRING
    },
    amount: {
      type: DataTypes.STRING
    },
    income_account: {
      type: DataTypes.INTEGER,
      references: {
        // 外键引用的模型
        model: AccountsModel,
        // 外键引用模型的列名
        key: 'account_id'
      }
    },
    expend_account: {
      type: DataTypes.INTEGER,
      references: {
        // 外键引用的模型
        model: AccountsModel,
        // 外键引用模型的列名
        key: 'account_id'
      }
    },
    type: {
      type: DataTypes.TINYINT
    },
    createtime: {
      type: DataTypes.TIME
    },
    link_abook: {
      type: DataTypes.INTEGER,
      references: {
        // 外键引用的模型
        model: Account_BookModel,
        // 外键引用模型的列名
        key: 'id'
      }
    },
    tu_id: {
      type: DataTypes.BIGINT,
      references: {
        // 外键引用的模型
        model: UserModel,
        // 外键引用模型的列名
        key: 'id'
      }
    },
    notes: {
      type: DataTypes.STRING
    }
  },
  {
    freezeTableName: true // 防止修改表名为复数
  }
);

TransferModel.belongsTo(AccountsModel, { foreignKey: 'income_account', as: 'incomeAccount' });
TransferModel.belongsTo(AccountsModel, { foreignKey: 'expend_account', as: 'expendAccount' });

module.exports = TransferModel;
