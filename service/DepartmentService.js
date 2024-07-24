const DepartmentModule = require('../models/DepartmentModule')
const sequelize = require('../config/db.config')
const { Op } = require('@sequelize/core')
const generatePath = require('../utils/generatePath');

const DepartmentService = {
  // 获取所有部门数据
  getDepartmentList: async ({ company_name, status }) => {
    try {
      // 定义查询条件对象
      const whereClause = {}
      if (company_name) {
        whereClause.company_name = {
          [Op.like]: `${company_name}%`,
        }
      }
      if (status) {
        whereClause.status = {
          [Op.eq]: status,
        }
      }
      let departments = await DepartmentModule.findAll({
        where: whereClause,
      })
      return departments.map((department) => department.toJSON())
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 添加部门or公司
  addDepartment: async (department) => {
    try {
      let result = await DepartmentModule.create(department)
      result.path = await generatePath(result);
      await result.save()
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 根据ID删除资源数据，包括子资源
  deleteDepartmentCascadeById: async (id) => {
    // 自动开启托管事物
    try {
      const result = await sequelize.transaction(async t => {
      // 删除子资源
      await DepartmentModule.destroy({
        where: {
          parent_id: { [Op.in]: id }
        },

      },{ transaction: t });

      // 删除父资源
      const department = await DepartmentModule.destroy({
        where: {
          id: { [Op.in]: id }
        },

      },{ transaction: t });
      return department;
      });
      return result
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 根据ID修改资源数据
  updateDepartmentById: async (id, updatedData) => {
    try {
      const department = await DepartmentModule.findByPk(id);
      if (!department) {
        throw new Error('Department not found');
      }
      delete updatedData.createtime
      updatedData.path = await generatePath(updatedData);
      const result = await DepartmentModule.update(updatedData, {
        where: {
          id,
        },
      })
      // 更新所有子部门的path
      const updateChildPaths = async (parent_id) => {
        const children = await DepartmentModule.findAll({ where: { parent_id } });
        for (const child of children) {
          child.path = await generatePath(child);
          await child.save();
          await updateChildPaths(child.id);
        }
      };
      await updateChildPaths(department.id);
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 根据资源id获取资源数据
  getDepartmentListById: async (id) => {
    try {
      let result = await DepartmentModule.findAll({
        where: {
          id,
        },
        raw: true,
      })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 查询部门所属用户
  // getUserForDepartment: async (id,{currentPage, pageSize}) => {
  //   try {
  //   // 将字符串格式的参数转换为数字类型
  //   currentPage = parseInt(currentPage, 10)
  //   pageSize = parseInt(pageSize, 10)
      
  //    // 验证转换是否成功
  //   if (isNaN(currentPage) || isNaN(pageSize) || currentPage <= 0 || pageSize <= 0) {
  //     throw new Error('传入的参数不正确，必须是正整数。')
  //   }      
  //     // 计算偏移量
  //     const offset = (currentPage - 1) * pageSize
  //     let departments = await DepartmentModule.findAndCountAll({
  //       where: {
  //         id
  //       },
  //       include: UserModel,
  //       offset: offset,
  //       limit: pageSize,
  //       raw: true,
  //     })
  //     return departments.map((department) => department.toJSON())
  //   } catch (error) {
  //     return Promise.reject(error)
  //   }
  // },
  // // 查询未分配用户
  // getUserForDepartmentInNull: async () => {
  //   try {
  //     let sql = `
  //     SELECT ur.*
  //     FROM user_department ud
  //     INNER JOIN user ur ON ud.user_id = ur.id
  //     WHERE ud.department_id is NULL
  //     `

  //     return results
  //   } catch (error) {
  //     return Promise.reject(error)
  //   }
  // }
}

module.exports = DepartmentService
