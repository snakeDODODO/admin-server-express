const Account_BookModel = require('../models/Account_BookModel');
const { Op } = require('@sequelize/core');

const A_BookService = {
  // 获取全部账本列表
  getA_BookListAll: async () => {
    try {
      const result = await Account_BookModel.findAll();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 账本列表获取（带参）
  getA_BookList: async ({ bookname, currentPage, pageSize }) => {
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
      // 账本名称
      if (bookname) {
        whereClause.bookname = {
          [Op.like]: `${bookname}%`
        };
      }
      // 计算偏移量
      const offset = (currentPage - 1) * pageSize;
      const rows = await Account_BookModel.findAndCountAll({
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
  // 添加账本
  addA_Book: async a_book => {
    try {
      let result = await Account_BookModel.create(a_book, {
        raw: true, // 返回原始数据而不是模型实例
        returning: true // 插入数据后返回那些字段（可指定，例['id']），参数可以是一个数组或者布尔值true，true返回所有字段
      });
      if (!result) return 'fail';
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 删除账本
  deleteA_Book: async AbookToDelete => {
    try {
      let result = await Account_BookModel.destroy({
        where: {
          id: { [Op.in]: AbookToDelete }
        }
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 更新账本
  updateA_Book: async (id, a_book) => {
    try {
      const result = await Account_BookModel.update(a_book, {
        where: { id },
        fields: ['bookname', 'bookicon'],
        raw: true
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

module.exports = A_BookService;


