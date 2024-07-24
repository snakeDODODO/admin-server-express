const { validationResult } = require("express-validator");
const ApiResult = require("../utils/ApiResult");

// parallel processing 并行处理
// 暴露一个函数，函数接收验证规则，返回一个函数
module.exports = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    console.log(errors);
    res.status(400).json({ errors: errors.array() });

  };
};
