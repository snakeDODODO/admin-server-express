class ApiResult {
  constructor(code, msg, data) {
    // 状态码
    this.code = code
    // 提示信息
    this.msg = msg
    // 泛型数据
    this.data = data
  }

  static Success(code,msg,data) {
    return new ApiResult(code,msg,data).toJson()
  }

  static Fail(code,msg) {
    return new ApiResult(code,msg,null).toJson()
  }

  toJson() {
    return {
      code: this.code,
      data: this.data,
      msg: this.msg
    }
  }
}

module.exports = ApiResult
