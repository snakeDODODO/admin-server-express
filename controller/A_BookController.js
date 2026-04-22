const A_BookService = require('../service/A_BookService')
const ApiResult = require('../utils/ApiResult')

const A_BookController = {
  // 获取全部账本列表
  getA_BookListAll: async (req,res,next) => {
    try {
      let result = await A_BookService.getA_BookListAll()
      if (!result) {
        res.send(ApiResult.Fail(400,'账本列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'账本列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  // 获取账本(带参)
  getA_BookList: async (req,res,next) => {
    try {
      let result = await A_BookService.getA_BookList(req.query)
      if (!result) {
        res.send(ApiResult.Fail(400,'账本列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'账本列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  // 添加账本
  addA_Book: async (req,res,next) => {
    try {
      let result = await A_BookService.addA_Book(req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'添加账本失败'))
      } else {
        res.send(ApiResult.Success(200,'添加账本成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 删除账本
  deleteA_Book: async (req,res,next) => {
    try {
      let result = await A_BookService.deleteA_Book(req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'删除账本失败'))
      } else {
        res.send(ApiResult.Success(200,'删除账本成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 更新账本
  updateA_Book: async (req,res,next) => {
    try {
      let result = await A_BookService.updateA_Book(req.params.id,req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'更新账本失败'))
      } else {
        res.send(ApiResult.Success(200,'更新账本成功','success'))
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = A_BookController