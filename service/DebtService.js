const DebtModel = require('../models/DebtModel');
const { Op } = require('@sequelize/core');
const BillModel = require('../models/BillModel');
const Sequelize = require('../config/db.config');

// 报销
const DebtService = {
  getDebtListAll: async ({ id, status, link_account, type }) => {
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

      if (link_account == 'null') {
        whereClause.link_account = {
          [Op.is]: null
        };
      }

      if (type) {
        whereClause.type = {
          [Op.eq]: type
        };
      }

      const rows = await DebtModel.findAll({
        where: whereClause,
        raw: true
      });

      return rows;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getDebtList: async ({ nickname, createtime, link_abook, link_account, status, type, currentPage, pageSize }) => {
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
      if (nickname) {
        whereClause.nickname = {
          [Op.like]: `${nickname}%`
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

      if (link_account) {
        whereClause.link_account = {
          [Op.eq]: link_account
        };
      }

      if (status) {
        whereClause.status = {
          [Op.eq]: status
        };
      }

      if (type) {
        whereClause.type = {
          [Op.eq]: type
        };
      }
      // 计算偏移量
      const offset = (currentPage - 1) * pageSize;
      const rows = await DebtModel.findAndCountAll({
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
  addDebt: async dept => {
    const transaction = await Sequelize.startUnmanagedTransaction();
    try {
      let result = await DebtModel.create(dept, {
        raw: true, // 返回原始数据而不是模型实例
        returning: true, // 插入数据后返回那些字段（可指定，例['id']），参数可以是一个数组或者布尔值true，true返回所有字段
        transaction
      });
      let amount = dept.amount;
      let debt_id = result.id;
      let createtime = dept.createtime;
      let bu_id = dept.du_id;
      let link_abook = dept.link_abook;
      let bc_id = 14;
      let type = dept.type == 0 ? 4 : 3;
      await BillModel.create(
        {
          amount,
          createtime,
          bu_id,
          bc_id,
          link_abook,
          type,
          debt_id
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
  deleteDebt: async deptToDelete => {
    try {
      let result = await DebtModel.destroy({
        where: {
          id: { [Op.in]: deptToDelete }
        }
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  updateDebt: async (id, dept) => {
    const transaction = await Sequelize.startUnmanagedTransaction();
    try {
      const result = await DebtModel.update(dept, {
        where: { id },
        raw: true,
        transaction
      });
      let amount = dept.amount;
      let createtime = dept.createtime;
      let link_abook = dept.link_abook;
      let bc_id = 13;
      let type = dept.type == 0 ? 4 : 3;
      await BillModel.update(
        {
          amount,
          createtime,
          bc_id,
          link_abook,
          type
        },
        {
          where: { debt_id: id },
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

module.exports = DebtService;
