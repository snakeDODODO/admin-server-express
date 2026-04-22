const ReimburseModel = require('../models/ReimburseModel');
const { Op } = require('@sequelize/core');
const BillModel = require('../models/BillModel');
const Sequelize = require('../config/db.config');

// 报销
const ReimburseService = {
  getReimburseListAll: async ({ id, status, reimburse_in_account, reimburse_ex_account }) => {
    try {
      // 定义查询条件对象 名称 编码 状态
      const whereClause = {};
      if (id) {
        whereClause.id = {
          [Op.eq]: id
        };
      }

      if (status) {
        whereClause.status = {
          [Op.eq]: status
        };
      }

      if (reimburse_in_account == 'null') {
        whereClause.reimburse_in_account = {
          [Op.is]: null
        };
      }

      if (reimburse_ex_account == 'null') {
        whereClause.reimburse_ex_account = {
          [Op.is]: null
        };
      }

      const rows = await ReimburseModel.findAll({
        where: whereClause,
        raw: true
      });

      return rows;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getReimburseList: async ({ project_name, createtime, link_abook, status, currentPage, pageSize }) => {
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
      // 报销名称
      if (project_name) {
        whereClause.project_name = {
          [Op.like]: `${project_name}%`
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

      if (link_abook) {
        whereClause.link_abook = {
          [Op.eq]: link_abook
        };
      }

      if (status) {
        whereClause.status = {
          [Op.eq]: status
        };
      }
      // 计算偏移量
      const offset = (currentPage - 1) * pageSize;
      const rows = await ReimburseModel.findAndCountAll({
        where: whereClause,
        offset: offset,
        limit: pageSize,
        raw: true
      });
      return rows;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  addReimburse: async reimburse => {
    const transaction = await Sequelize.startUnmanagedTransaction();
    try {
      let result = await ReimburseModel.create(reimburse, {
        raw: true, // 返回原始数据而不是模型实例
        returning: true, // 插入数据后返回那些字段（可指定，例['id']），参数可以是一个数组或者布尔值true，true返回所有字段
        transaction
      });
      let amount = reimburse.amount;
      let reimburse_id = result.id;
      let createtime = reimburse.createtime;
      let bu_id = reimburse.ru_id;
      let link_abook = reimburse.link_abook;
      let bc_id = 15;
      let type = 2;
      await BillModel.create(
        {
          amount,
          createtime,
          bu_id,
          bc_id,
          link_abook,
          type,
          reimburse_id
        },
        { transaction }
      );
      if (!result) return 'fail';
      await transaction.commit();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  deleteReimburse: async reimburseToDelete => {
    try {
      let result = await ReimburseModel.destroy({
        where: {
          id: { [Op.in]: reimburseToDelete }
        }
      });
      return result;
    } catch (error) {
      await transaction.rollback();
      return Promise.reject(error);
    }
  },
  updateReimburse: async (id, reimburse) => {
    const transaction = await Sequelize.startUnmanagedTransaction();
    try {
      const result = await ReimburseModel.update(reimburse, {
        where: { id },
        raw: true,
        transaction
      });
      let amount = reimburse.amount;
      let createtime = reimburse.createtime;
      let bu_id = reimburse.ru_id;
      let link_abook = reimburse.link_abook;
      let bc_id = 15;
      await BillModel.update(
        {
          amount,
          createtime,
          bu_id,
          bc_id,
          link_abook
        },
        {
          where: { reimburse_id: id },
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

module.exports = ReimburseService;
