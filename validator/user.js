const { query, body } = require('express-validator')
const validate = require('../middleware/validate')
const UserModel = require('../models/UserModel')

exports.login = validate([
  // 配置验证规则
  body('username').notEmpty().withMessage('用户名不能为空'),
  body('password').notEmpty().withMessage('密码不能为空'),
])

// 添加用户校验
exports.addUser = validate([
  body('username')
    .notEmpty()
    .withMessage('用户名不可为空')
    .bail()
    .custom(async (value) => {
      // 查询数据库查看数据是否存在
      const user = await UserModel.findOne({
        where: { username: value },
      })
      if (user) {
        return Promise.reject('用户已存在')
      }
    })
    .bail(),
  body('nickname').notEmpty().withMessage('姓名不可为空').bail(),
  body('phone').notEmpty().withMessage('手机号不可为空').bail(),
  body('createtime').notEmpty().withMessage('创建时间不可为空').bail(),
  body('status').notEmpty().withMessage('状态不可为空').bail(),
])

// 修改用户校验
exports.updateUser = validate([
  body('id')
  .notEmpty()
  .withMessage('id不可为空')
  .bail(),
  body('password').notEmpty().withMessage('密码不可为空').bail(),
  body('phone').notEmpty().withMessage('手机号不可为空').bail(),
  body('status').notEmpty().withMessage('状态不可为空').bail(),
])
