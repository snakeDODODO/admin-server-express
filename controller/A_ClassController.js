const A_ClassService = require('../service/A_ClassService')
const ApiResult = require('../utils/ApiResult')

const A_ClassController = {
  // 获取全部账户列表
  getA_ClassListAll: async (req,res,next) => {
    try {
      let result = await A_ClassService.getA_ClassListAll()
      if (!result) {
        res.send(ApiResult.Fail(400,'账户类别列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'账户类别列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  // 获取账户列表(带参)
  getA_ClassList: async (req,res,next) => {
    try {
      let result = await A_ClassService.getA_ClassList(req.query)
      if (!result) {
        res.send(ApiResult.Fail(400,'账户类别列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'账户类别列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  // 添加账户
  addA_Class: async (req,res,next) => {
    try {
      let result = await A_ClassService.addA_Class(req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'添加账户类别失败'))
      } else {
        res.send(ApiResult.Success(200,'添加账户类别成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 删除账户
  deleteA_Class: async (req,res,next) => {
    try {
      let result = await A_ClassService.deleteA_Class(req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'删除账户类别失败'))
      } else {
        res.send(ApiResult.Success(200,'删除账户类别成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 更新账户
  updateA_Class: async (req,res,next) => {
    try {
      let result = await A_ClassService.updateA_Class(req.params.id,req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'更新账户类别失败'))
      } else {
        res.send(ApiResult.Success(200,'更新账户类别成功','success'))
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = A_ClassController
