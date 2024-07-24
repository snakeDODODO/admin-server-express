var express = require('express');
const DepartmentController = require('../controller/DepartmentController')
var DepartmentRouter = express.Router();

/* GET users listing. */
DepartmentRouter.get('/api/department/getdepartmentlist/:convert', DepartmentController.getDepartmentList); // 部门列表获取接口
DepartmentRouter.post('/api/department/adddepartment', DepartmentController.addDepartment); // 添加部门接口
DepartmentRouter.post('/api/department/deletedepartment', DepartmentController.deleteDepartment); // 删除部门接口
DepartmentRouter.put('/api/department/updatedepartment/:id', DepartmentController.updateDepartment); // 更新部门接口
// DepartmentRouter.get('/api/department/getusersfordepartment/:id', DepartmentController.getUsersForDepartment); // 获取所属部门用户

module.exports = DepartmentRouter;