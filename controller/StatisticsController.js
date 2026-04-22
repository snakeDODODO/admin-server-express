const StatisticsService = require('../service/StatisticsService');
const ApiResult = require('../utils/ApiResult');
const AccountsService = require('../service/AccountsService');

const StatisticsController = {
  // 获取账户计算余额
  getAccountBalance: async (req, res, next) => {
    try {
      let result = await AccountsService.getAccountListAll();
      for (const account of result) {
        let newBalance = await AccountsService.getAccountBalance(account.account_id);
        account.balance = parseFloat(account.balance) + newBalance[0].bill_balance + newBalance[0].debt_balance + newBalance[0].transfer_balance + newBalance[0].reimburse_balance;
      }
      if (!result) {
        res.send(ApiResult.Fail(400, '账户余额获取失败'));
      } else {
        res.send(ApiResult.Success(200, '账户余额获取成功', result));
      }
    } catch (error) {
      next(error);
    }
  },
  // 获取账单列表
  getBillListByShowTable: async (req, res, next) => {
    try {
      let result = await StatisticsService.getBillListByShowTable(req.query);
      if (!result) {
        res.send(ApiResult.Fail(400, '账单列表获取失败'));
      } else {
        res.send(ApiResult.Success(200, '账单列表获取成功', result));
      }
    } catch (error) {
      next(error);
    }
  },
  // 查询最近七天收入或支出的数据
  getBillByWeek: async (req, res, next) => {
    try {
      let result = await StatisticsService.getBillByWeek(req.query);
      if (!result) {
        res.send(ApiResult.Fail(400, '账单列表获取失败'));
      } else {
        res.send(ApiResult.Success(200, '账单列表获取成功', result));
      }
    } catch (error) {
      next(error);
    }
  },
  // 查询月份收支的数据
  getYearlyIncomeExpenses: async (req, res, next) => {
    try {
      let result = await StatisticsService.getYearlyIncomeExpenses(req.query);
      if (!result) {
        res.send(ApiResult.Fail(400, '账单列表获取失败'));
      } else {
        res.send(ApiResult.Success(200, '账单列表获取成功', result));
      }
    } catch (error) {
      next(error);
    }
  },
  // 查询年费收支的数据
  getYearlyIE: async (req, res, next) => {
    try {
      let result = await StatisticsService.getYearlyIE();
      if (!result) {
        res.send(ApiResult.Fail(400, '账单列表获取失败'));
      } else {
        res.send(ApiResult.Success(200, '账单列表获取成功', result));
      }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = StatisticsController;
