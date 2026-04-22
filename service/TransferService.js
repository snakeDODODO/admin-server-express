const TransferModel = require('../models/TransferModel');
const { Op } = require('@sequelize/core');
const AccountsModel = require('../models/AccountsModel');
const Sequelize = require('../config/db.config');
const BillModel = require('../models/BillModel');

// 转账
const TransferService = {
  getA_ClassListAll: async ({ id }) => {
    try {
      const whereClause = {};
      if (id) {
        whereClause.id = {
          [Op.eq]: id
        };
      }

      const result = await TransferModel.findAll({
        where: whereClause
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getTransferList: async ({ createtime, income_account, expend_account, currentPage, pageSize }) => {
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
      // 转账日期
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

      if (income_account) {
        whereClause.income_account = {
          [Op.eq]: income_account
        };
      }

      if (expend_account) {
        whereClause.expend_account = {
          [Op.eq]: expend_account
        };
      }
      // 计算偏移量
      const offset = (currentPage - 1) * pageSize;
      const rows = await TransferModel.findAndCountAll({
        where: whereClause,
        offset: offset,
        limit: pageSize,
        include: [
          { model: AccountsModel, as: 'incomeAccount', attributes: ['account_name'] },
          { model: AccountsModel, as: 'expendAccount', attributes: ['account_name'] }
        ],
        raw: false
      });
      return rows;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  addTransfer: async transfer => {
    // 手动托管
    const transaction = await Sequelize.startUnmanagedTransaction();
    try {
      // let result = await TransferModel.create(transfer, {
      //   raw: true, // 返回原始数据而不是模型实例
      //   returning: true, // 插入数据后返回那些字段（可指定，例['id']），参数可以是一个数组或者布尔值true，true返回所有字段
      // });
      let result = await TransferModel.create(transfer, {
        raw: true, // 返回原始数据而不是模型实例
        returning: true, // 插入数据后返回那些字段（可指定，例['id']），参数可以是一个数组或者布尔值true，true返回所有字段
        transaction
      });
      let amount = transfer.amount;
      let transfer_id = result.id;
      let createtime = transfer.createtime;
      let bu_id = transfer.tu_id;
      let link_abook = transfer.link_abook;
      let bc_id = 14;
      let type = 4;
      await BillModel.create(
        {
          amount,
          createtime,
          bu_id,
          bc_id,
          link_abook,
          type,
          transfer_id
        },
        { transaction }
      );
      if (!result) return 'fail';
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      return Promise.reject(error);
    }
  },
  deleteTransfer: async transferToDelete => {
    try {
      let result = await TransferModel.destroy({
        where: {
          id: { [Op.in]: transferToDelete }
        }
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  updateTransfer: async (id, transfer) => {
    // 手动托管
    const transaction = await Sequelize.startUnmanagedTransaction();
    try {
      let result = await TransferModel.update(transfer, {
        where: { id },
        raw: true,
        transaction
      });
      let amount = transfer.amount;
      let createtime = transfer.createtime;
      let bu_id = transfer.tu_id;
      let link_abook = transfer.link_abook;
      let bc_id = 14;
      await BillModel.update(
        {
          amount,
          createtime,
          bu_id,
          bc_id,
          link_abook
        },
        {
          where: { transfer_id: id },
          raw: true,
          transaction
        }
      );
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      return Promise.reject(error);
    }
  }
};

module.exports = TransferService;
