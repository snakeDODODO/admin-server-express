const { DBHOST, DBNAME, DBPASSWORD, DBUSER } = require('./config')
const { Sequelize } = require('@sequelize/core')

const sequelize = new Sequelize(DBNAME, DBUSER, DBPASSWORD, {
  host: DBHOST,
  // 选择一种支持的数据库:
  // 'mysql', 'mariadb', 'postgres', 'mssql', 'sqlite', 'snowflake', 'db2' or 'ibmi'
  dialect: 'mysql', // 数据库类型
  timezone: '+08:00', // 时区
  logging: console.log, // 日志输出方式
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    // 强制define的第一个参数模型名称等于表名称，全局设置之后就无需再定义表名称了
    freezeTableName: true,
    // 关闭模型创建时自创的时间戳
    timestamps: false,
    freezeTableName: true
  }
})

// 自调用测试连接是否成功
// ;(async () => {
//   try {
//     await sequelize.authenticate()
//     console.log('数据连接成功')
//   } catch (error) {
//     console.error('数据库无法启动，原因:', error)
//   }
// })()

module.exports = sequelize
