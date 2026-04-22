const TransferService = require('../service/TransferService')
const ApiResult = require('../utils/ApiResult')
const BillService = require('../service/BillService')
// 转账
const TransferController = {
  getTransferListAll: async (req,res,next) => {
    try {
      let result = await TransferService.getA_ClassListAll(req.query)
      if (!result) {
        res.send(ApiResult.Fail(400,'转账列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'转账列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  getTransferList: async (req,res,next) => {
    try {
      let result = await TransferService.getTransferList(req.query)
      if (!result) {
        res.send(ApiResult.Fail(400,'转账列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'转账列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  addTransfer: async (req,res,next) => {
    try {
      let result = await TransferService.addTransfer(req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'添加转账失败'))
      } else {
        res.send(ApiResult.Success(200,'添加转账成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  deleteTransfer: async (req,res,next) => {
    try {
      let result = await TransferService.deleteTransfer(req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'删除转账失败'))
      } else {
        res.send(ApiResult.Success(200,'删除转账成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  updateTransfer: async (req,res,next) => {
    try {
      let result = await TransferService.updateTransfer(req.params.id,req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'更新转账失败'))
      } else {
        res.send(ApiResult.Success(200,'更新转账成功','success'))
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = TransferController