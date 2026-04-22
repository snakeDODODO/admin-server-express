const { DataTypes } = require('@sequelize/core');
// 将数据库连接对象导入
const sequelize = require('../config/db.config');
const UserModel = require('./UserModel');
const Bill_classificationModel = require('./Bill_classificationModel');
const Account_BookModel = require('./Account_BookModel');
const AccountsModel = require('./AccountsModel');
const ReimburseModel = require('./ReimburseModel');
const DebtModel = require('./DebtModel');
const TransferModel = require('./TransferModel');

// 创建模型
const BillModel = sequelize.define(
  'bill',
  {
    // 定义模型属性
    // 如果有主键，应该像如下定义
    id: {
      type: DataTypes.INTEGER,
      // 自动递增
      autoIncrement: true,
      // 是否是主键
      primaryKey: true
    },
    bc_id: {
      // 字段类型
      type: DataTypes.INTEGER,
      references: {
        // 外键引用的模型
        model: Bill_classificationModel,
        // 外键引用模型的列名
        key: 'id'
      }
    },
    createtime: {
      type: DataTypes.TIME
    },
    updatetime: {
      type: DataTypes.TIME
    },
    incomeid: {
      type: DataTypes.INTEGER,
      references: {
        // 外键引用的模型
        model: Account_BookModel,
        // 外键引用模型的列名
        key: 'id'
      }
    },
    account_id: {
      type: DataTypes.INTEGER,
      references: {
        // 外键引用的模型
        model: AccountsModel,
        // 外键引用模型的列名
        key: 'account_id'
      }
    },
    bu_id: {
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
    },
    ibudget: {
      type: DataTypes.TINYINT
    },
    iicome_expenses: {
      type: DataTypes.TINYINT
    },
    amount: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.INTEGER
    },
    reimburse_id: {
      type: DataTypes.INTEGER,
      references: {
        // 外键引用的模型
        model: ReimburseModel,
        // 外键引用模型的列名
        key: 'id'
      }
    },
    debt_id: {
      type: DataTypes.INTEGER,
      references: {
        // 外键引用的模型
        model: DebtModel,
        // 外键引用模型的列名
        key: 'id'
      }
    },
    transfer_id: {
      type: DataTypes.INTEGER,
      references: {
        // 外键引用的模型
        model: TransferModel,
        // 外键引用模型的列名
        key: 'id'
      }
    }
  },
  {
    freezeTableName: true // 防止修改表名为复数
  }
);

// 一对多
BillModel.belongsTo(UserModel, { foreignKey: 'bu_id' });
BillModel.belongsTo(Bill_classificationModel, { foreignKey: 'bc_id' });
BillModel.belongsTo(Account_BookModel, { foreignKey: 'incomeid' });
BillModel.belongsTo(AccountsModel, { foreignKey: 'account_id' });
BillModel.belongsTo(TransferModel, { foreignKey: 'transfer_id' });
BillModel.belongsTo(DebtModel, { foreignKey: 'debt_id' });
BillModel.belongsTo(ReimburseModel, { foreignKey: 'reimburse_id' });

// 一对一
TransferModel.hasOne(BillModel, { foreignKey: 'transfer_id' });
DebtModel.hasOne(BillModel, { foreignKey: 'debt_id' });
ReimburseModel.hasOne(BillModel, { foreignKey: 'reimburse_id' });
// 一对多
Bill_classificationModel.hasMany(BillModel, { foreignKey: 'bc_id' });
Account_BookModel.hasMany(BillModel, { foreignKey: 'incomeid' });
AccountsModel.hasMany(BillModel, { foreignKey: 'account_id' });
module.exports = BillModel;
