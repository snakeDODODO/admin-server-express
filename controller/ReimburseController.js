const ReimburseService = require('../service/ReimburseService')
const ApiResult = require('../utils/ApiResult')
const BillService = require('../service/BillService')

// 报销
const ReimburseController = {
  getReimburseListAll: async (req,res,next) => {
    try {
      let result = await ReimburseService.getReimburseListAll(req.query)
      if (!result) {
        res.send(ApiResult.Fail(400,'报销列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'报销列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  getReimburseList: async (req,res,next) => {
    try {
      let result = await ReimburseService.getReimburseList(req.query)
      if (!result) {
        res.send(ApiResult.Fail(400,'报销列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'报销列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  addReimburse: async (req,res,next) => {
    try {
      let result = await ReimburseService.addReimburse(req.body)
      let amount = req.body.amount
      let createtime = req.body.createtime
      let bu_id = req.body.tu_id
      let link_abook = req.body.link_abook
      let bc_id = 15
      let type = 2
      await BillService.addBill({
        amount,
        createtime,
        bu_id,
        bc_id,
        link_abook,
        type
      })
      if (!result) {
        res.send(ApiResult.Fail(400,'添加报销失败'))
      } else {
        res.send(ApiResult.Success(200,'添加报销成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  deleteReimburse: async (req,res,next) => {
    try {
      let result = await ReimburseService.deleteReimburse(req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'删除报销失败'))
      } else {
        res.send(ApiResult.Success(200,'删除报销成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  updateReimburse: async (req,res,next) => {
    try {
      let result = await ReimburseService.updateReimburse(req.params.id,req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'更新报销失败'))
      } else {
        res.send(ApiResult.Success(200,'更新报销成功','success'))
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ReimburseController