const { Op, where } = require('@sequelize/core')
const UserModel = require('../models/UserModel')
const UserRoleModel = require('../models/UserRoleModel')
const DepartmentModule = require('../models/DepartmentModule')
const getAllSubDepartmentIds = require('../utils/getAllSubDepartmentIds');

const UserService = {
  // 登录
  login: async ({ username, password }) => {
    try {
      const user = await UserModel.findOne({
        attributes: ['id', 'username', 'nickname', 'avatar', 'phone', 'lasttime', 'status'],
        where: {
          username,
          password,
        },
        raw: true,
      })
      return user
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 获取单个用户信息
  getUserByInfomation: async ({ username }) => {
    try {
      // 定义查询条件对象
      const userInfo = await UserModel.findOne({
        where: username,
        raw: true,
      })
      return userInfo
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 获取所有用户列表
  selectAllUser: async ({ username, nickname, phone, status, department_id, currentPage, pageSize }) => {
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
      // 添加用户名查询条件
      if (username) {
        whereClause.username = {
          [Op.eq]: username,
        }
      }
      // 添加姓名查询条件
      if (nickname) {
        whereClause.nickname = {
          [Op.like]: `${nickname}%`,
        }
      }
      // 添加手机号查询条件
      if (phone) {
        whereClause.phone = {
          [Op.eq]: phone,
        }
      }
      // 添加账号状态查询条件
      if (status) {
        whereClause.status = {
          [Op.eq]: status,
        }
      }
      // 添加所属部门查询
      if (department_id) {
        const departmentIds = await getAllSubDepartmentIds(department_id);
        whereClause.department_id = departmentIds;
      }
      // 计算偏移量
      const offset = (currentPage - 1) * pageSize
      let rows = await UserModel.findAndCountAll({
        where: whereClause,
        // 联表查询
        include: DepartmentModule,
        offset: offset,
        limit: pageSize,
        raw: true,
      })
      return rows
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 添加用户
  addUser: async (user) => {
    try {
      const result = await UserModel.create(user, {
        raw: true,
        returning: true,
      })
      if (!result) return 'fail'
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 删除用户
  deleteUser: async (usersToDelete) => {
    try {
      const result = await UserModel.destroy({
        where: {
          id: { [Op.in]: usersToDelete },
        },
      })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 修改用户
  updateUser: async (user) => {
    try {
      const { id, password, nickname, phone, status,department_id } = user
      const [result] = await UserModel.update(
        {
          password,
          nickname,
          phone,
          status,
          department_id
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
  // 更新用户状态
  updateUserStatus: async (status,id) => {
    try {
      const [result] = await UserModel.update(
        {
          status
        },
        {
          where: { id },
          raw: true
        }
      )
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 根据用户id批量新增角色
  insertRolesByUserId: async (userRoleArray) => {
    try {
      let result = await UserRoleModel.bulkCreate(userRoleArray, {
        fields: ['user_id', 'role_id'], // 指定要插入的字段
        returning: true, // 返回插入的行数据
      })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 根据用户id删除该用户所有角色
  deleteByUserId: async (id) => {
    try {
      const deletedRows = await UserRoleModel.destroy({
        where: {
          user_id: id,
        },
      })
      return deletedRows
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 根据用户id查询角色id集合
  selectIdsByUserId: async (id) => {
    try {
      const result = await UserRoleModel.findAll({
        where: {
          user_id: id,
        },
        raw: true,
      })
      // 提取查询结果中的 resource_id 并返回
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
}

module.exports = UserService
