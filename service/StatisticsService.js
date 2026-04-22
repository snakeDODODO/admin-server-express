const BillModel = require('../models/BillModel');
const { Op } = require('@sequelize/core');
const { fn, col } = require('@sequelize/core');
const { Sequelize } = require('@sequelize/core');
const UserModel = require('../models/UserModel');
const Bill_classificationModel = require('../models/Bill_classificationModel');
const Account_BookModel = require('../models/Account_BookModel');
const AccountsModel = require('../models/AccountsModel');

const StatisticsService = {
  // 计算账户余额
  getAccountBalance: async account_id => {
    try {
      const result = await AccountsModel.findAll({
        where: { account_id },
        attributes: [
          'account_id',
          'account_name',
          'balance',

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
  },
  // 账单获取
  getBillListByShowTable: async ({ pageSize, createtime }) => {
    try {
      // 将字符串格式的参数转换为数字类型
      pageSize = parseInt(pageSize, 10);

      // 验证转换是否成功
      if (isNaN(pageSize) || pageSize <= 0) {
        pageSize = null;
        // throw new Error('传入的参数不正确，必须是正整数。');
      }

      // 定义查询条件对象 名称 编码 状态
      const whereClause = {};
      // 账单日期
      if (createtime) {
        whereClause.createtime = {
          [Op.gte]: createtime[0], // 本月开始时间
          [Op.lte]: createtime[1] // 本月结束时间
        };
      }
      const rows = await BillModel.findAll({
        attributes: ['id', 'amount', 'type', 'createtime'],
        order: [['createtime', 'DESC']],
        where: whereClause,
        limit: pageSize,
        include: [
          {
            model: UserModel,
            attributes: ['id', 'username']
          },
          {
            model: Bill_classificationModel,
            attributes: ['classification_name', 'classification_icon']
          },
          {
            model: Account_BookModel,
            attributes: ['bookname']
          },
          {
            model: AccountsModel,
            attributes: ['account_name']
          }
        ],
        raw: false
      });
      return rows;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 查询最近七天收入或支出的数据
  getBillByWeek: async ({ createtime, type }) => {
    try {
      // 定义查询条件对象
      const whereClause = {};
      if (createtime) {
        whereClause.createtime = {
          [Op.gte]: createtime[0], // 本周开始时间
          [Op.lte]: createtime[1] // 本周结束时间
        };
      }

      if (type) {
        whereClause.type = {
          [Op.eq]: type
        };
      }
      const rows = await BillModel.findAll({
        attributes: [
          [Sequelize.fn('DATE', Sequelize.col('createtime')), 'day'],
          [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_expense']
        ],
        where: whereClause,
        group: ['day'],
        order: [['day', 'ASC']],
        raw: false
      });
      return rows;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 查询月份收支的数据
  getYearlyIncomeExpenses: async ({ createtime }) => {
    try {
      const results = await BillModel.findAll({
        attributes: [[fn('MONTH', col('createtime')), 'month'], 'type', [fn('SUM', col('amount')), 'total']],
        where: {
          createtime: {
            [Op.between]: [createtime[0], createtime[1]]
          }
        },
        group: ['month', 'type'],
        order: [['month', 'ASC']],
        raw: false
      });

      // 初始化每个月的收入和支出为 0
      const incomeExpenses = {};
      for (let m = 1; m <= 12; m++) {
        incomeExpenses[m] = { income: 0, expense: 0 };
      }

      // 处理查询结果
      results.forEach(record => {
        const month = record.get('month');
        const type = record.get('type');
        const total = parseFloat(record.get('total'));

        if (type === 1) {
          // 假设 1 为收入
          incomeExpenses[month].income = total;
        } else if (type === 0) {
          // 假设 0 为支出
          incomeExpenses[month].expense = total;
        } else {
          incomeExpenses[month].other = total;
        }
      });

      // 转换为数组格式
      const monthlyData = [];
      for (let m = 1; m <= 12; m++) {
        monthlyData.push({
          month: m,
          income: incomeExpenses[m].income ? incomeExpenses[m].income : 0,
          expense: incomeExpenses[m].expense ? incomeExpenses[m].expense : 0,
          other: incomeExpenses[m].other ? incomeExpenses[m].other : 0
        });
      }

      return monthlyData;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 查询年份收支的数据
  getYearlyIE: async () => {
    // const currentYear = new Date().getFullYear();
    // const startYear = currentYear - 11;
    // 获取当前年份
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 12 }, (_, i) => currentYear - i);

    // 构建查询的年份区间
    const startYear = currentYear - 11; // 12年前开始
    const startDate = new Date(`${startYear}-01-01T00:00:00.000Z`); // 开始日期
    const endDate = new Date(`${currentYear}-12-31T23:59:59.999Z`); // 结束日期
    try {
      const results = await BillModel.findAll({
        attributes: [
          [fn('YEAR', col('createtime')), 'year'], // 提取年份
          [Sequelize.literal('SUM(CASE WHEN `type` = 1 THEN `amount` ELSE 0 END)'), 'income'],
          [Sequelize.literal('SUM(CASE WHEN `type` = 0 THEN `amount` ELSE 0 END)'), 'expense']
        ],
        where: {
          createtime: {
            [Op.between]: [startDate.toISOString(), endDate.toISOString()]
          }
        },
        group: ['year'],
        order: [['year', 'ASC']],
        raw: true
      });
      const allYears = Array.from({ length: 12 }, (_, index) => {
        return new Date().getFullYear() - index; // 创建当前年份到过去11年的年份数组
      }).reverse(); // 反转为升序
      // 将查询结果转换为一个对象，以便快速查找
      const resultMap = results.reduce((acc, row) => {
        acc[row.year] = {
          income: row.income || 0,
          expense: row.expense || 0
        };
        return acc;
      }, {});
      // 将年份与结果合并
      const finalResults = allYears.map(year => ({
        year,
        income: resultMap[year]?.income || 0,
        expense: resultMap[year]?.expense || 0
      }));
      return finalResults;
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

module.exports = StatisticsService;
