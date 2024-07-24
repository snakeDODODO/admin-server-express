const DictionaryDataModule = require('../models/DictionaryDataModule')
const { Op } = require('@sequelize/core')

const DictionaryDataService = {
  // 获取所有数据字典列表
  getDictionaryDataListById: async ({dictionary_id,dictionaryname,dictionaryvalue,status,currentPage, pageSize}) => {
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
      if (dictionary_id) {
        whereClause.dictionary_id = {
          [Op.eq]: dictionary_id,
        }
      }
      if (dictionaryname) {
        whereClause.dictionaryname = {
          [Op.eq]: dictionaryname,
        }
      }
      if (status) {
        whereClause.status = {
          [Op.eq]: status,
        }
      }
      if (dictionaryvalue) {
        whereClause.dictionaryvalue = {
          [Op.like]: `${dictionaryvalue}%`,
        }
      }
      // 计算偏移量
      const offset = (currentPage - 1) * pageSize
      const rows = await DictionaryDataModule.findAndCountAll({
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
  // 添加数据字典
  addDictionaryData: async (dictionaryData) => {
    try {
      const result = await DictionaryDataModule.create(dictionaryData, {
        raw: true,
        returning: true,
      })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 根据ID删除字典数据
  deleteDictionaryData: async (dictionaryDataToDelete) => {
    try {
      const result = await DictionaryDataModule.destroy({
        where: {
          id: { [Op.in]: dictionaryDataToDelete },
        },
      })
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // // 根据ID修改字典数据
  updateDictionaryDataById: async (id, updatedData) => {
    try {
      const result = await DictionaryDataModule.update(updatedData, {
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

module.exports = DictionaryDataService
