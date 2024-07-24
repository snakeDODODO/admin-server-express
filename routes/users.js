var express = require('express');
const UserController = require('../controller/UserController');
var UserRouter = express.Router();
const userValidator = require("../validator/user");

/* GET users listing. */
UserRouter.post('/api/user/login', userValidator.login,UserController.login); // 登录接口
UserRouter.get('/api/user/getuserbyinfo',UserController.getUserByInfo); // 获取单个用户信息
UserRouter.get('/api/user/getuserlist',UserController.getUserList);// 获取用户列表
UserRouter.post('/api/user/adduser',userValidator.addUser,UserController.addUser);// 添加用户
UserRouter.post('/api/user/deleteuser',UserController.deleteUser);// 删除用户
UserRouter.put('/api/user/updateuser',userValidator.updateUser,UserController.updateUser);// 修改用户
UserRouter.put('/api/user/updateuserstatus/:id',UserController.changeUserStatus); // 修改用户状态
UserRouter.post('/api/user/addrolesbyuserid',UserController.addRolesByUserId);// 根据用户id批量新增角色
UserRouter.delete('/api/user/delbyuserid/:id',UserController.delByUserId);// 根据用户id删除该用户所有角色
UserRouter.get('/api/user/searchidsbyuserid/:id',UserController.searchIdsByUserId);// 根据用户id查询角色id集合

module.exports = UserRouter;
