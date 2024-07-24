const AuthService = require('../service/AuthService');
const ApiResult = require('../utils/ApiResult');

const AuthController = {
  // 登录接口
  AuthResourceList: async (req,res) => {
    let result = await AuthService.viewAuth(req.params.id)
    // 权限获取
    if(!result){
      res.send(ApiResult.Fail(400,'权限获取错误'))
    } else {
      res.send(ApiResult.Success(200,'权限获取成功',result))
    }
  }
}

module.exports = AuthController