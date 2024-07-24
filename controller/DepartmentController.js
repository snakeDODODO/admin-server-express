const DepartmentService = require('../service/DepartmentService');
const ApiResult = require('../utils/ApiResult');
const departmentChange = require('../utils/handleTreeOptimized')

const DepartmentController = {
  // 查询部门列表数据
  getDepartmentList: async (req,res,next) => {
    try {
      let result
      result = await DepartmentService.getDepartmentList(req.query)
      if (JSON.parse(req.params.convert)) {
        result = departmentChange.handleTreeOptimized(result)
      } 
      if(!result){
        res.send(ApiResult.Fail(400,'部门列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'部门列表获取成功',result))
      }  
    } catch (error) {
      next(error)
    }
  },
  // 添加部门
  addDepartment: async (req,res,next) => {
    try {
      let result = await DepartmentService.addDepartment(req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'添加部门失败'))
      } else {
        res.send(ApiResult.Success(200,'添加部门成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 删除部门
  deleteDepartment: async (req,res,next) => {
    try {
      let result = await DepartmentService.deleteDepartmentCascadeById(req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'删除部门失败'))
      } else {
        res.send(ApiResult.Success(200,'删除部门成功','success'))
      } 
    } catch (error) {
      next(error)
    }
  },
  // 更新部门
  updateDepartment: async (req,res,next) => {
    try {
      let result = await DepartmentService.updateDepartmentById(req.params.id,req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'更新部门失败'))
      } else {
        res.send(ApiResult.Success(200,'更新部门成功','success'))
      } 
    } catch (error) {
      next(error)
    }
  },
  // 根据部门id返回部门数据
  getDepartmentListById: async (req,res,next) => {
    try {
      let resource = await DepartmentService.getDepartmentListById(req.params.id,req.body)
      let result = departmentChange.handleTreeOptimized(resource)
      if(!result){
        res.send(ApiResult.Fail(400,'部门列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'部门列表获取成功',result))
      }  
    } catch (error) {
      next(error)
    }
  },
  // // // 查询所属部门用户
  // getUsersForDepartment: async (req,res,next) => {
  //   try {
  //     let result = await DepartmentService.getUserForDepartment(req.params.id)
  //     if(!result){
  //       res.send(ApiResult.Fail(400,'部门列表获取失败'))
  //     } else {
  //       res.send(ApiResult.Success(200,'部门列表获取成功',result))
  //     }  
  //   } catch (error) {
  //     next(error)
  //   }
  // },
}

module.exports = DepartmentController