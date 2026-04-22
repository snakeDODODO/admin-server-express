const A_ClassModel = require('../models/A_ClassModel');
const { Op } = require('@sequelize/core');

const A_ClassService = {
  // 获取全部账户列表
  getA_ClassListAll: async () => {
    try {
      const result = await A_ClassModel.findAll();
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 账户类别列表获取（带参）
  getA_ClassList: async ({ a_class, currentPage, pageSize }) => {
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
      // 账户类别名称
      if (a_class) {
        whereClause.a_class = {
          [Op.like]: `${a_class}%`
        };
      }
      // 计算偏移量
      const offset = (currentPage - 1) * pageSize;
      const rows = await A_ClassModel.findAndCountAll({
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
  // 添加账户类别
  addA_Class: async a_class => {
    try {
      let result = await A_ClassModel.create(a_class, {
        raw: true, // 返回原始数据而不是模型实例
        returning: true // 插入数据后返回那些字段（可指定，例['id']），参数可以是一个数组或者布尔值true，true返回所有字段
      });
      if (!result) return 'fail';
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 删除账户类别
  deleteA_Class: async AclassToDelete => {
    try {
      let result = await A_ClassModel.destroy({
        where: {
          id: { [Op.in]: AclassToDelete }
        }
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 更新账户类别
  updateA_Class: async (id, a_class) => {
    try {
      const result = await A_ClassModel.update(a_class, {
        where: { id },
        fields: ['a_class', 'a_icon'],
        raw: true
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

module.exports = A_ClassService;
