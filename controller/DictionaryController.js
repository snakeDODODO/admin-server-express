const DictionaryService = require('../service/DictionaryService')
const ApiResult = require('../utils/ApiResult')

const DictionaryController = {
  // 获取字典列表（条件）
  getDictionaryAll: async (req,res,next) => {
    try {
      let result = await DictionaryService.getDictionaryList(req.query)
      if (!result) {
        res.send(ApiResult.Fail(400,'字典列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'字典列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  // 获取字典存储store
  getDictionaryForStore: async (req,res,next) => {
    try {
      let result = await DictionaryService.getDictionaryForStore()
      if (!result) {
        res.send(ApiResult.Fail(400,'字典列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'字典列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  // 添加字典
  addDictionary: async (req,res,next) => {
    try {
      let result = await DictionaryService.addResource(req.body)
        if (!result) {
          res.send(ApiResult.Fail(400,'字典添加失败'))
        } else {
          res.send(ApiResult.Success(200,'字典添加成功','success'))
        }  
    } catch (error) {
      next(error)  
    }
  },
  // 删除字典
  delDictionaryById: async (req,res,next) => {
    try {
      let result = await DictionaryService.deleteDictionary(req.body)
      if (result === 0) {
        res.send(ApiResult.Fail(400,'删除字典失败'))
      } else {
        res.send(ApiResult.Success(200,'删除字典成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 修改字典
  updateDictionary: async (req,res,next) => {
    try {
      let result = await DictionaryService.updateDictionaryById(req.params.id,req.body)
      if (result === 0) {
        res.send(ApiResult.Fail(400,'字典更新失败'))
      } else {
        res.send(ApiResult.Success(200,'字典更新成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 修改字典状态
  changeDictionaryStatus: async (req,res,next) => {
    try {
      let result = await DictionaryService.updateDictionaryById(req.params.id,req.body.status)
      if (!result) {
        res.send(ApiResult.Fail(400,'状态更新失败'))
      } else {
        res.send(ApiResult.Success(200,'状态更新成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
}

module.exports = DictionaryController
