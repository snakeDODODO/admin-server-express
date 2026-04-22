const { DataTypes } = require('@sequelize/core')
// 将数据库连接对象导入
const sequelize = require('../config/db.config')
const Account_BookModel = require('./Account_BookModel')
const AccountsModel = require('./AccountsModel')
const UserModel = require('./UserModel')

// 债务
const DebtModel = sequelize.define('debt',{
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nickname: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.STRING,
  },
  link_account: {
    type: DataTypes.INTEGER,
    references: {
      // 外键引用的模型
      model: AccountsModel,
      // 外键引用模型的列名
      key: 'account_id'
    }
  },
  status: {
    type: DataTypes.TINYINT,
  },
  createtime: {
    type: DataTypes.TIME,
  },
  endtime: {
    type: DataTypes.TIME,
  },
  icon_name: {
    type: DataTypes.STRING,
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
  du_id: {
    type: DataTypes.BIGINT,
    references: {
      // 外键引用的模型
      model: UserModel,
      // 外键引用模型的列名
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.TINYINT,
  }
},{
  freezeTableName: true, // 防止修改表名为复数
})

module.exports = DebtModel