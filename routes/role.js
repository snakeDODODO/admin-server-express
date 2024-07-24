var express = require('express');
var RoleRouter = express.Router();
var RoleController = require('../controller/RoleController')

/* GET home page. */
RoleRouter.get('/api/role/getrolelistall',RoleController.getRoleListAll)
RoleRouter.get('/api/role/getrolelist',RoleController.AuthResourceList);
RoleRouter.post('/api/role/addrole',RoleController.addRole); // 添加角色
RoleRouter.post('/api/role/delrole',RoleController.delRoleById); // 删除角色
RoleRouter.put('/api/role/updaterole',RoleController.updateRole); // 更新角色
RoleRouter.put('/api/role/updaterolestatus/:id',RoleController.changeRoleStatus); //修改角色状态
RoleRouter.post('/api/role/addresourcebyroleid', RoleController.addResourceByRoleId); // 添加角色id所属权限
RoleRouter.delete('/api/role/deleterole/:id', RoleController.deleteByRoleId); // 删除角色以及相关权限
RoleRouter.get('/api/role/roleid/:id', RoleController.selectIdByRoleId); // 根据角色id获取资源列表

module.exports = RoleRouter;
