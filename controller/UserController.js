const UserService = require('../service/UserService');
const ApiResult = require('../utils/ApiResult');
const JWT = require('../utils/JWT');
const AuthService = require('../service/AuthService');

const UserController = {
  // 登录接口
  login: async (req, res, next) => {
    try {
      let result = await UserService.login(req.body);
      if (!result) return res.send(ApiResult.Fail(400, '用户名或密码不对'));
      let roles = await UserService.selectIdsByUserId(result.id);
      // let roleIds = roles.map(role => role.role_id);
      let resourceIds = await AuthService.viewAuth(result.id);
      // 登录校验
      if (!resourceIds || !roles) {
        res.send(ApiResult.Fail(400, '无权限登录'));
      } else {
        result.roles = roles;
        result.resourceIds = resourceIds;
        // 生成token(用户信息,有效时间7天)
        const token = JWT.generate(
          {
            id: result.id,
            username: result.username
          },
          '7d'
        );
        res.header('Authorization', token); // token封装在响应头返回给前端
        res.send(ApiResult.Success(200, '操作成功', result));
      }
    } catch (error) {
      next(error);
    }
  },
  // 查询单个用户
  getUserByInfo: async (req, res, next) => {
    try {
      let result = await UserService.getUserByInfomation(req.query);
      if (!result) {
        res.send(ApiResult.Fail(400, '用户不存在'));
      } else {
        res.send(ApiResult.Success(200, '用户已存在', 1));
      }
    } catch (error) {
      next(error);
    }
  },
  // 获取用户列表
  getUserList: async (req, res, next) => {
    try {
      let result = await UserService.selectAllUser(req.query);
      // 联表查询由于性能和耦合过深原因，这里改为分步查询
      // 提取所有用户的ID，用于下一步查询
      const userIds = result.rows.map(user => user.id);
      // Step 2: 根据用户ID查询角色
      const roles = await UserService.selectIdsByUserId(userIds);
      result.rows.forEach(user => {
        user.roles = roles.filter(role => role.user_id === user.id);
      });
      if (!result) {
        res.send(ApiResult.Fail(400, '用户列表获取失败'));
      } else {
        res.send(ApiResult.Success(200, '用户列表获取成功', result));
      }
    } catch (error) {
      next(error);
    }
  },
  // 添加用户
  addUser: async (req, res, next) => {
    try {
      let result = await UserService.addUser(req.body);
      let roleIds = req.body.roleIds.map(roleId => ({
        user_id: result.id,
        role_id: roleId
      }));
      let RoleUpdateByUser = await UserService.insertRolesByUserId(roleIds);
      if (!result || !RoleUpdateByUser) {
        res.send(ApiResult.Fail(400, '用户添加失败'));
      } else {
        res.send(ApiResult.Success(200, '用户添加成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  },
  // 删除用户
  deleteUser: async (req, res, next) => {
    try {
      let result = await UserService.deleteUser(req.body);
      if (result === 0) {
        res.send(ApiResult.Fail(400, '删除失败'));
      } else {
        res.send(ApiResult.Success(200, '删除成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  },
  // 修改用户（表格）
  updateUser: async (req, res, next) => {
    try {
      let userUpdate = await UserService.updateUser(req.body);
      // 先删除再循环添加
      await UserService.deleteByUserId(req.body.id);
      let RoleUpdateByUser;
      if (req.body.roleIds) {
        let roleIds = req.body.roleIds.map(roleId => ({
          user_id: req.body.id,
          role_id: roleId
        }));
        RoleUpdateByUser = await UserService.insertRolesByUserId(roleIds);
      }
      if (!userUpdate && !RoleUpdateByUser) {
        res.send(ApiResult.Fail(400, '更新权限失败'));
      } else {
        res.send(ApiResult.Success(200, '更新成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  },
  // 修改用户个人资料
  changeProfile: async (req, res, next) => {
    try {
      // 更新用户资料
      let result = await UserService.changeProfile(req.params.id, req.body);
      if (!result) {
        res.send(ApiResult.Fail(400, '修改个人资料失败'));
      } else {
        res.send(ApiResult.Success(200, '修改个人资料成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  },
  // 修改密码
  changePassword: async (req, res, next) => {
    try {
      let result = await UserService.changePassword(req.params.id, req.body.password);
      if (!result) {
        res.send(ApiResult.Fail(400, '修改密码失败'));
      } else {
        res.send(ApiResult.Success(200, '修改密码成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  },
  // 修改用户状态
  changeUserStatus: async (req, res, next) => {
    try {
      const result = await UserService.updateUserStatus(req.params.id, req.body.status);
      if (!result) {
        res.send(ApiResult.Fail(400, '状态更新失败'));
      } else {
        res.send(ApiResult.Success(200, '状态更新成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  },
  // 根据用户id批量新增角色
  addRolesByUserId: async (req, res, next) => {
    try {
      let result = await UserService.insertRolesByUserId(req.body.userRoleArray);
      if (result !== 'success') {
        res.send(ApiResult.Fail(400, '新增失败'));
      } else {
        res.send(ApiResult.Success(200, '新增成功', result));
      }
    } catch (error) {
      next(error);
    }
  },
  // 根据用户id删除该用户所有角色
  delByUserId: async (req, res, next) => {
    try {
      let result = await UserService.deleteByUserId(req.params.id);
      if (result !== 'success') {
        res.send(ApiResult.Fail(400, '删除失败'));
      } else {
        res.send(ApiResult.Success(200, '删除成功', result));
      }
    } catch (error) {
      next(error);
    }
  },
  // 根据用户id查询角色id集合
  searchIdsByUserId: async (req, res, next) => {
    try {
      let result = await UserService.selectIdsByUserId(req.params.id);
      if (!result) {
        res.send(ApiResult.Fail(400, '角色列表获取失败'));
      } else {
        res.send(ApiResult.Success(200, '角色列表获取成功', result));
      }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = UserController;
