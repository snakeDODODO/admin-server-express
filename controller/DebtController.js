const DebtService = require('../service/DebtService')
const ApiResult = require('../utils/ApiResult')
const BillService = require('../service/BillService')

// 债务
const DebtController = {
  getDebtListAll: async (req,res,next) => {
    try {
      let result = await DebtService.getDebtListAll(req.query)
      if (!result) {
        res.send(ApiResult.Fail(400,'债务列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'债务列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  getDebtList: async (req,res,next) => {
    try {
      let result = await DebtService.getDebtList(req.query)
      if (!result) {
        res.send(ApiResult.Fail(400,'债务列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'债务列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  addDebt: async (req,res,next) => {
    try {
      let result = await DebtService.addDebt(req.body)
      let amount = req.body.amount
      let createtime = req.body.createtime
      let bu_id = req.body.tu_id
      let link_abook = req.body.link_abook
      let bc_id = req.body.type == 0 ? 13 : 16
      let type = req.body.type == 0 ? 3 : 4
      await BillService.addBill({
        amount,
        createtime,
        bu_id,
        bc_id,
        link_abook,
        type
      })
      if (!result) {
        res.send(ApiResult.Fail(400,'添加债务失败'))
      } else {
        res.send(ApiResult.Success(200,'添加债务成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  deleteDebt: async (req,res,next) => {
    try {
      let result = await DebtService.deleteDebt(req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'删除债务失败'))
      } else {
        res.send(ApiResult.Success(200,'删除债务成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  updateDebt: async (req,res,next) => {
    try {
      let result = await DebtService.updateDebt(req.params.id,req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'更新债务失败'))
      } else {
        res.send(ApiResult.Success(200,'更新债务成功','success'))
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = DebtController