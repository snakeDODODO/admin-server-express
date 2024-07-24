const DictionaryModule = require('../models/DictionaryModule')
const { Op } = require('@sequelize/core')

const DictionaryService = {
  // 获取所有数据字典列表
  getDictionaryList: async ({name,description,status,currentPage, pageSize}) => {
    try {
      // 将字符串格式的参数转换为数字类型
      currentPage = parseInt(currentPage, 10)
      pageSize = parseInt(pageSize, 10)

      // 验证转换是否成功
      if (isNaN(currentPage) || isNaN(pageSize) || currentPage <= 0 || pageSize <= 0) {
        throw new Error('传入的参数不正确，必须是正整数。')
      }
      // 定义查询条件对象 名称 编码 状态
      const whereClause = {}
      if (name) {
        whereClause.name = {
          [Op.eq]: name,
        }
      }
      if (description) {
        whereClause.description = {
          [Op.like]: `${description}%`,
        }
      }
      if (status) {
        whereClause.status = {
          [Op.eq]: status,
        }
      }
      // 计算偏移量
      const offset = (currentPage - 1) * pageSize
      const rows = await DictionaryModule.findAndCountAll({
        where: whereClause,
        offset: offset,
        limit: pageSize,
        raw: true,
      })
      return rows
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 添加资源
  addResource: async (dictionary) => {
    try {
      // let result = await DictionaryModule.create(dictionary)
      const result = await DictionaryModule.create(dictionary, {
        raw: true,
        returning: true,
      })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 根据ID删除字典数据
  deleteDictionary: async (dictionarysToDelete) => {
    try {
      const result = await DictionaryModule.destroy({
        where: {
          id: { [Op.in]: dictionarysToDelete },
        },
      })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // // 根据ID修改字典数据
  updateDictionaryById: async (id, updatedData) => {
    try {
      const result = await DictionaryModule.update(updatedData, {
        where: {
          id,
        },
      })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
}

module.exports = DictionaryService
