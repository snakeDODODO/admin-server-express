const Bill_classificationService = require('../service/Bill_classificationService')
const ApiResult = require('../utils/ApiResult')
const departmentChange = require('../utils/handleTreeOptimized')

const Bill_classificationController = {
  getBill_classificationList: async (req,res,next) => {
    try {
      let result = await Bill_classificationService.getBill_classificationList(req.query)
      // 账户列表转化格式，父类携带子类数组
      result = departmentChange.handleTreeOptimized(result)
      if (!result) {
        res.send(ApiResult.Fail(400,'账单类别列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'账单分类列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  addBill_classification: async (req,res,next) => {
    try {
      let result = await Bill_classificationService.addBill_classification(req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'添加账单类别失败'))
      } else {
        res.send(ApiResult.Success(200,'添加账单类别成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  deleteBill_classification: async (req,res,next) => {
    try {
      let result = await Bill_classificationService.deleteBill_classification(req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'删除账单类别失败'))
      } else {
        res.send(ApiResult.Success(200,'删除账单类别成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  updateBill_classification: async (req,res,next) => {
    try {
      let result = await Bill_classificationService.updateBill_classification(req.params.id,req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'更新账单类别失败'))
      } else {
        res.send(ApiResult.Success(200,'更新账单类别成功','success'))
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Bill_classificationController
