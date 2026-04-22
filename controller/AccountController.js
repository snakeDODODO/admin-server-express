const AccountsService = require('../service/AccountsService')
const ApiResult = require('../utils/ApiResult')

const AccountController = {
  // 获取账户列表
  getAccountListAll: async (req,res,next) => {
    try {
      let result = await AccountsService.getAccountListAll()
      if (!result) {
        res.send(ApiResult.Fail(400,'账户列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'账户列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  // 获取账户列表（带参）
  getAccountList: async (req,res,next) => {
    try {
      // forEach 不会等待内部的异步操作完成
      let result = await AccountsService.getAccountList(req.query)
      // const accountIds = result.rows.map((account) => account.account_id)
      // let accountBalance = await AccountsService.getAccountBalance(accountIds)
      // 使用 for...of 循环
      for (const account of result.rows) {
        let newBalance = await AccountsService.getAccountBalance(account.account_id);
        account.balance = parseFloat(account.balance) + newBalance[0].bill_balance + newBalance[0].debt_balance + newBalance[0].transfer_balance +  newBalance[0].reimburse_balance
      }
      // result.rows.forEach((account) => {
      //   account.balance = accountBalance.filter((balance) => balance.account_id === account.account_id).map((balance) => balance.bill_balance + balance.debt_balance + balance.transfer_balance + balance.reimburse_balance)[0]
      // });
      if (!result) {
        res.send(ApiResult.Fail(400,'账户列表获取失败'))
      } else {
        res.send(ApiResult.Success(200,'账户列表获取成功',result))
      }
    } catch (error) {
      next(error)
    }
  },
  // 添加账户
  addAccount: async (req,res,next) => {
    try {
      let result = await AccountsService.addAccount(req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'添加账户失败'))
      } else {
        res.send(ApiResult.Success(200,'添加账户成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 删除账户
  deleteAccounts: async (req,res,next) => {
    try {
      let result = await AccountsService.deleteAccount(req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'删除账户失败'))
      } else {
        res.send(ApiResult.Success(200,'删除账户成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 更新账户
  updateAccount: async (req,res,next) => {
    try {
      let result = await AccountsService.updateAccount(req.params.account_id,req.body)
      if (!result) {
        res.send(ApiResult.Fail(400,'更新账户失败'))
      } else {
        res.send(ApiResult.Success(200,'更新账户成功','success'))
      }
    } catch (error) {
      next(error)
    }
  },
  // 计算账户余额
  getAccountBalance: async (req,res,next) => {
    try {
      let result = await AccountsService.getAccountBalance(req.params.accountId)
      if (!result) {
        res.send(ApiResult.Fail(400,'获取账户余额失败'))
      } else {
        res.send(ApiResult.Success(200,'获取账户余额成功',result))
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = AccountController
