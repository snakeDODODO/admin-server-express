const BillModel = require('../models/BillModel');
const { Op } = require('@sequelize/core');
const UserModel = require('../models/UserModel');
const Bill_classificationModel = require('../models/Bill_classificationModel');
const Account_BookModel = require('../models/Account_BookModel');
const AccountsModel = require('../models/AccountsModel');
const TransferModel = require('../models/TransferModel');
const DebtModel = require('../models/DebtModel');
const ReimburseModel = require('../models/ReimburseModel');
const Sequelize = require('../config/db.config');

const BillService = {
  // 账单获取
  getBillList: async ({ bc_id, createtime, incomeid, account_id, bu_id, currentPage, pageSize }) => {
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
      // 账单类型
      if (bc_id) {
        whereClause.bc_id = {
          [Op.eq]: bc_id
        };
      }
      // 账单日期
      if (createtime) {
        const startOfDay = new Date(createtime);
        const endOfDay = new Date(createtime);
        startOfDay.setHours(startOfDay.getHours() + 8); // 加八个小时
        endOfDay.setDate(endOfDay.getDate() + 1); // 设置为下一天的开始时间
        endOfDay.setHours(endOfDay.getHours() + 8); // 加八个小时
        endOfDay.setSeconds(endOfDay.getSeconds() - 1); // 减一秒

        whereClause.createtime = {
          [Op.gte]: startOfDay.toISOString(), // 转换为 ISO 格式
          [Op.lt]: endOfDay.toISOString() // 转换为 ISO 格式
        };
      }
      // 所属账本
      if (incomeid) {
        whereClause.incomeid = {
          [Op.eq]: incomeid
        };
      }
      // 关联账户
      if (account_id) {
        whereClause.account_id = {
          [Op.eq]: account_id
        };
      }
      // 账单所属用户
      if (bu_id) {
        whereClause.bu_id = {
          [Op.eq]: bu_id
        };
      }
      // 计算偏移量
      const offset = (currentPage - 1) * pageSize;
      const rows = await BillModel.findAndCountAll({
        where: whereClause,
        offset: offset,
        limit: pageSize,
        include: [
          {
            model: UserModel
          },
          {
            model: Bill_classificationModel,
            attributes: ['classification_name', 'classification_icon', 'parent_id']
          },
          {
            model: Account_BookModel,
            attributes: ['bookname']
          },
          {
            model: AccountsModel,
            attributes: ['account_name']
          },
          {
            model: DebtModel
          },
          {
            model: TransferModel
          },
          {
            model: ReimburseModel
          }
        ],
        raw: false
      });
      return rows;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 新增账单
  addBill: async bill => {
    try {
      // 添加主表记录
      let result = await BillModel.create(bill, {
        raw: true, // 返回原始数据而不是模型实例
        returning: true // 插入数据后返回那些字段（可指定，例['id']），参数可以是一个数组或者布尔值true，true返回所有字段
      });
      if (!result) return 'fail';

      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 删除账单
  deleteBill: async billToDelete => {
    // 手动托管
    const transaction = await Sequelize.startUnmanagedTransaction();
    try {
      console.log(billToDelete[0]);
      let result = await BillModel.destroy({
        where: {
          id: { [Op.in]: billToDelete[0] }
        },
        transaction
      });

      const modelsToDelete = [
        { model: ReimburseModel, ids: billToDelete[1] },
        { model: DebtModel, ids: billToDelete[2] },
        { model: TransferModel, ids: billToDelete[3] }
      ];

      for (const { model, ids } of modelsToDelete) {
        if (ids && ids.length > 0) {
          await model.destroy({
            where: {
              id: { [Op.in]: ids }
            },
            transaction // 使用事务
          });
        }
      }
      // if (billToDelete[1].length != 0) {
      //   await ReimburseModel.destroy({
      //     where: {
      //       id: { [Op.in]: billToDelete[1] }
      //     }
      //   });
      // }
      // if (billToDelete[2].length != 0) {
      //   await DebtModel.destroy({
      //     where: {
      //       id: { [Op.in]: billToDelete[2] }
      //     }
      //   });
      // }
      // if (billToDelete[3].length != 0) {
      //   await TransferModel.destroy({
      //     where: {
      //       id: { [Op.in]: billToDelete[3] }
      //     }
      //   });
      // }
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      return Promise.reject(error);
    }
  },
  // 更新账单
  updateBill: async (id, bill) => {
    try {
      const result = await BillModel.update(bill, {
        where: { id },
        fields: ['bc_id', 'incomeid', 'account_id', 'notes', 'ibudget', 'iicome_expenses', 'amount', 'type', 'createtime'],
        raw: true
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

module.exports = BillService;
