const AccountsModel = require('../models/AccountsModel');
const { Op,fn, col,literal } = require('@sequelize/core');
const A_ClassModel = require('../models/A_ClassModel')
const { Sequelize } = require('@sequelize/core');

const AccountsService = {
  // 账户列表获取
  getAccountListAll: async () => {
    try {
      const result = await AccountsModel.findAll({
        include: [
          {
            model: A_ClassModel,
          },
        ],
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 账户列表获取（带参）
  getAccountList: async ({account_name,aclass_id,currentPage,pageSize}) => {
    try {
      // 将字符串格式的参数转换为数字类型
      currentPage = parseInt(currentPage, 10);
      pageSize = parseInt(pageSize, 10);

      // 验证转换是否成功
      if (isNaN(currentPage) || isNaN(pageSize) || currentPage <= 0 || pageSize <= 0) {
        throw new Error('传入的参数不正确，必须是正整数。');
      }
      // 定义查询条件对象 名称 编码 状态
      const whereClause = {};
      // 账户类型
      if (aclass_id) {
        whereClause.aclass_id = {
          [Op.eq]: aclass_id
        };
      }
      // 账户名称
      if (account_name) {
        whereClause.account_name = {
          [Op.like]: `${account_name}%`
        };
      }
      // 计算偏移量
      const offset = (currentPage - 1) * pageSize;
      const rows = await AccountsModel.findAndCountAll({
        where: whereClause,
        offset: offset,
        limit: pageSize,
        // 不加参数，只要raw结果集不调整成false,让其返回Sequelize的实例就可以让Sequelize自动归类成子数据
        include: [
          {
            model: A_ClassModel,
            attributes: ['a_class','a_icon']
          },
        ],
        // raw: false（默认）:
        //   返回的结果是 Sequelize 模型实例，这些实例具有模型的所有方法和属性。
        //   可以通过实例方法（如 get()）访问模型的属性和相关的实例方法。
        // raw: true:
        //   返回的结果是原始数据对象，不会是 Sequelize 实例。
        //   每个结果将是一个普通的 JavaScript 对象，适合进行直接的数据处理。
        //   不再拥有模型的方法，适用于只需要数据而不需要模型功能的情况。
        raw: true
      });
      return rows;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 添加账户
  addAccount: async (account) => {
    try {
      let result = await AccountsModel.create(account, {
        raw: true, // 返回原始数据而不是模型实例
        returning: true, // 插入数据后返回那些字段（可指定，例['id']），参数可以是一个数组或者布尔值true，true返回所有字段
      })
      if (!result) return 'fail'
      return result
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // 删除账户
  deleteAccount: async AccountToDelete => {
    try {
      let result = await AccountsModel.destroy({
        where: {
          account_id: { [Op.in]: AccountToDelete }
        }
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 更新账户
  updateAccount: async (account_id, account) => {
    try {
      const result = await AccountsModel.update(account, {
        where: { account_id },
        fields: ['account_name', 'aclass_id','balance'],
        raw: true
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 计算账户余额
  getAccountBalance : async (account_id) => {
    try {
      const result = await AccountsModel.findAll({
        where: { account_id },
        attributes: [
          'account_id',
          'account_name',
      
          // 计算账单的收入和支出余额
          [
            fn(
              'IFNULL',
              Sequelize.literal(`
                (SELECT SUM(CASE 
                    WHEN b.type = 1 THEN b.amount
                    WHEN b.type = 0 THEN -b.amount
                    ELSE 0 
                END) 
                FROM bill b 
                WHERE b.account_id = accounts.account_id)`),
              0
            ),
            'bill_balance'
          ],
      
          // 计算债务的借入和借出余额
          [
            fn(
              'IFNULL',
              Sequelize.literal(`
                (SELECT SUM(CASE 
                    WHEN d.type = 1 AND d.status = 0 THEN d.amount
                    WHEN d.type = 0 AND d.status = 0 THEN -d.amount
                    ELSE 0 
                END) 
                FROM debt d 
                WHERE d.link_abook = accounts.account_id)`),
              0
            ),
            'debt_balance'
          ],
      
          // 计算转账的转入和转出余额
          [
            fn(
              'IFNULL',
              Sequelize.literal(`
                (SELECT SUM(CASE 
                    WHEN t.expend_account = accounts.account_id THEN -t.amount
                    WHEN t.income_account = accounts.account_id THEN t.amount
                    ELSE 0 
                END) 
                FROM transfer t 
                WHERE t.expend_account = accounts.account_id OR t.income_account = accounts.account_id)`),
              0
            ),
            'transfer_balance'
          ],
      
          // 计算报销的支出和收入余额
          [
            fn(
              'IFNULL',
              Sequelize.literal(`
                (SELECT SUM(CASE 
                    WHEN r.status = 0 AND r.reimburse_in_account = accounts.account_id THEN -r.amount
                    WHEN r.status = 1 AND r.reimburse_ex_account = accounts.account_id THEN r.amount
                    ELSE 0 
                END) 
                FROM reimburse r 
                WHERE r.reimburse_in_account = accounts.account_id OR r.reimburse_ex_account = accounts.account_id)`),
              0
            ),
            'reimburse_balance'
          ]
        ],
        raw: true
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

module.exports = AccountsService;
