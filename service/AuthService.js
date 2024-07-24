const sequelize = require('../config/db.config')

const AuthService = {
  // 页面权限获取
  viewAuth: async ( user_id ) => {
    try {
      const sql = `
      SELECT rr.resource_id
      FROM user_role ur
      INNER JOIN role_resource rr ON ur.role_id = rr.role_id
      WHERE ur.user_id = :userId
      `
      const results = await sequelize.query(sql,{
        replacements: { userId: user_id },
        type: sequelize.QueryTypes.SELECT
      })
      return results.map((result) => result.resource_id);
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 操作权限
  // 数据权限
}

module.exports = AuthService
