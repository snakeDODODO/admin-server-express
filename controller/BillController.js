const BillService = require('../service/BillService')
const ApiResult = require('../utils/ApiResult')

const BillController = {
  // 获取账单列表
  getBillList: async (req,res,next) => {
    try {
      let result = await BillService.getBillList(req.query)
      if (!result) {
        res.send(ApiResult.Fail(400,'账单列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'账单列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  // 新增账单列表
  addBill: async (req,res,next) => {
    try {
      let result = await BillService.addBill(req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'添加账单失败'))
      } else {
        res.send(ApiResult.Success(200,'添加账单成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 删除订单列表
  deleteBill: async (req,res,next) => {
    try {
      let result = await BillService.deleteBill(req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'删除账单失败'))
      } else {
        res.send(ApiResult.Success(200,'删除账单成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 更新订单列表
  updateBill: async (req,res,next) => {
    try {
      let result = await BillService.updateBill(req.params.id,req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'更新账单失败'))
      } else {
        res.send(ApiResult.Success(200,'更新账单成功','success'))
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = BillController
