const RoleService = require('../service/RoleService')
const ApiResult = require('../utils/ApiResult')

const RoleController = {
  getRoleListAll: async (req,res,next) => {
    try {
      let result = await RoleService.getRoleListAll()
      if (!result) {
        res.send(ApiResult.Fail(400,'角色列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'角色列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  // 角色列表获取(条件版)
  AuthResourceList: async (req, res,next) => {
    try {
      let result = await RoleService.getRoleList(req.query)
      const roleIds = result.rows.map((role) => role.id)
      const resources = await RoleService.selectIdsByRoleId(roleIds)
      result.rows.forEach((role) => {
        role.resources = resources.filter((resource) => resource.role_id === role.id).map((resource) => resource.resource_id)
      })
      // 权限获取
      if (!result) {
        res.send(ApiResult.Fail(400, '角色列表获取错误'))
      } else {
        res.send(ApiResult.Success(200, '角色列表获取成功', result))
      }  
    } catch (error) {
      next(error)
    }
  },
  // 添加角色
  addRole: async (req,res,next) => {
    try {
      let result = await RoleService.addRole(req.body)
      if (req.body.resource) {
        let resourceIds = req.body.resources.map((resourceId) => ({
          role_id: result.id,
          resource_id: resourceId,
        }))
        let resourceUpdateByRole = await RoleService.addResourceByRoleId(resourceIds)
        if (!result && !resourceUpdateByRole) {
          res.send(ApiResult.Fail(400,'角色添加失败'))
        } else {
          res.send(ApiResult.Success(200,'角色添加成功','success'))
        }  
      } else {
        if (!result) {
          res.send(ApiResult.Fail(400,'角色添加失败'))
        } else {
          res.send(ApiResult.Success(200,'角色添加成功','success'))
        }  
      }
    } catch (error) {
      next(error)  
    }
  },
  // 删除角色
  delRoleById: async (req,res,next) => {
    try {
      let result = await RoleService.delRoleById(req.body)
      if (result === 0) {
        res.send(ApiResult.Fail(400,'删除角色失败'))
      } else {
        res.send(ApiResult.Success(200,'删除角色成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 修改角色
  updateRole: async (req,res,next) => {
    try {
      let roleUpdate = await RoleService.updateRole(req.body)
      if (req.body.resources) {
        await RoleService.deleteByRoleId(req.body.id)
        let resourceIds = req.body.resources.map((resourceId) => ({
          role_id: req.body.id,
          resource_id: resourceId,
        }))
        await RoleService.addResourceByRoleId(resourceIds)
      }
      if (!roleUpdate === 0 || !roleUpdate === 1) {
        res.send(ApiResult.Fail(400,'角色更新失败'))
      } else {
        res.send(ApiResult.Success(200,'角色更新成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 修改角色状态
  changeRoleStatus: async (req,res,next) => {
    try {
      let result = await RoleService.updateRoleStatus(req.body.status,req.params.id)
      if (!result) {
        res.send(ApiResult.Fail(400,'状态更新失败'))
      } else {
        res.send(ApiResult.Success(200,'状态更新成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 根据角色id批量增加权限
  addResourceByRoleId: async (req, res) => {
    let result = await RoleService.addResourceByRoleId(req.body)
    // 增加成功
    if (result !== 'success') {
      res.send(ApiResult.Fail(400, '添加失败'))
    } else {
      res.send(ApiResult.Success(200, '添加成功', result))
    }
  },
  // 根据角色id删除该角色下所有权限
  deleteByRoleId: async (req, res) => {
    let result = await RoleService.deleteByRoleId({roleId:req.params.id})
    // 删除回调
    if (result !== 'success') {
      res.send(ApiResult.Fail(400, '删除失败'))
    } else {
      res.send(ApiResult.Success(200, '删除成功', result))
    }
  },
  // 根据角色id获取资源列表
  selectIdByRoleId: async (req, res) => {
    let result = await RoleService.selectIdsByRoleId(req.params.id)
    // 权限获取
    if (!result) {
      res.send(ApiResult.Fail(400, '权限获取错误'))
    } else {
      res.send(ApiResult.Success(200, '操作成功', result))
    }
  },
}

module.exports = RoleController
