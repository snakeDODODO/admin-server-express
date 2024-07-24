const RoleModel = require('../models/RoleModel')
const { Op } = require('@sequelize/core')
const RoleResourceModel = require('../models/RoleResourceModel')

const RoleService = {
  getRoleListAll: async () => {
    try {
      const user = await RoleModel.findAll()
      return user
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 获取所有角色列表（条件版）
  getRoleList: async ({ sys_name, name, status, time, currentPage, pageSize }) => {
    try {
      // 将字符串格式的参数转换为数字类型
      currentPage = parseInt(currentPage, 10)
      pageSize = parseInt(pageSize, 10)

      // 验证转换是否成功
      if (isNaN(currentPage) || isNaN(pageSize) || currentPage <= 0 || pageSize <= 0) {
        throw new Error('传入的参数不正确，必须是正整数。')
      }

      // 定义查询条件对象
      const whereClause = {}
      if (sys_name) {
        whereClause.sys_name = {
          [Op.eq]: sys_name,
        }
      }
      if (name) {
        whereClause.name = {
          [Op.like]: `${name}%`,
        }
      }
      if (status) {
        whereClause.status = {
          [Op.eq]: status,
        }
      }
      if (time) {
        whereClause.createtime = {
          [Op.between]: [time[0], time[1]],
        }
      }
      // 计算偏移量
      const offset = (currentPage - 1) * pageSize
      const user = await RoleModel.findAndCountAll({
        where: whereClause,
        offset: offset,
        limit: pageSize,
        raw: true,
      })
      return user
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 添加角色
  addRole: async (role) => {
    try {
      const result = await RoleModel.create(role, {
        raw: true,
        returning: true,
      })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 删除角色
  delRoleById: async (rolesToDelete) => {
    try {
      let result = await RoleModel.destroy({
        where: {
          id: { [Op.in]: rolesToDelete },
        },
      })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 修改角色
  updateRole: async (role) => {
    try {
      const { id, name, sys_name, status } = role
      const [result] = await RoleModel.update(
        {
          name,
          sys_name,
          status,
        },
        {
          where: { id },
          raw: true,
        }
      )
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 修改角色状态
  updateRoleStatus: async (status,id) => {
    try {
      const [result] = await RoleModel.update(
        {
          status
        },
        {
          where: {id},
          raw: true
        }
      )
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 根据角色id批量增加权限
  addResourceByRoleId: async (roleResourcesArray) => {
    try {
      // 使用bulkCreate 方法批量插入数据
      await RoleResourceModel.bulkCreate(roleResourcesArray, {
        fields: ['role_id', 'resource_id'], // 指定要插入的字段
        returning: true, // 返回插入的行数据
      })
      return 'success'
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 根据角色id删除该角色下所有权限
  deleteByRoleId: async ( roleId ) => {
    try {
      const deletedRows = await RoleResourceModel.destroy({
        where: {
          role_id: roleId,
        },
      })
      console.log(`Deleted ${deletedRows} rows.`)
      return 'success'
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 根据角色id获取权限id
  selectIdsByRoleId: async (roleId) => {
    try {
      const result = await RoleResourceModel.findAll({
        where: {
          role_id: roleId,
        },
      })
      // 提取查询结果中的 resource_id 并返回
      // return result.map((record) => record.resource_id)
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
}

module.exports = RoleService
