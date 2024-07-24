const DictionaryDataService = require('../service/DictionaryDataService')
const ApiResult = require('../utils/ApiResult')

const DictionaryDataController = {
  // 获取字典列表（条件）
  getDictionaryDataAllById: async (req,res,next) => {
    try {
      let result = await DictionaryDataService.getDictionaryDataListById(req.query)
      if (!result) {
        res.send(ApiResult.Fail(400,'字典数据列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'字典数据列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  // 添加字典
  addDictionaryData: async (req,res,next) => {
    try {
      let result = await DictionaryDataService.addDictionaryData(req.body)
        if (!result) {
          res.send(ApiResult.Fail(400,'字典数据添加失败'))
        } else {
          res.send(ApiResult.Success(200,'字典数据添加成功','success'))
        }  
    } catch (error) {
      next(error)  
    }
  },
  // 删除字典数据
  delDictionaryDataById: async (req,res,next) => {
    try {
      let result = await DictionaryDataService.deleteDictionaryData(req.body)
      if (result === 0) {
        res.send(ApiResult.Fail(400,'删除字典数据失败'))
      } else {
        res.send(ApiResult.Success(200,'删除字典数据成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 修改字典数据
  updateDictionaryData: async (req,res,next) => {
    try {
      let result = await DictionaryDataService.updateDictionaryDataById(req.params.id,req.body)
      if (result === 0) {
        res.send(ApiResult.Fail(400,'字典数据更新失败'))
      } else {
        res.send(ApiResult.Success(200,'字典数据更新成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 修改字典数据状态
  changeDictionaryDataStatus: async (req,res,next) => {
    try {
      let result = await DictionaryDataService.updateDictionaryDataById(req.params.id,req.body.status)
      if (!result) {
        res.send(ApiResult.Fail(400,'字典数据状态更新失败'))
      } else {
        res.send(ApiResult.Success(200,'字典数据状态更新成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
}

module.exports = DictionaryDataController
