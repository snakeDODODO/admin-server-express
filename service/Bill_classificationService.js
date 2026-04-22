const Bill_classificationModel = require('../models/Bill_classificationModel');
const { Op } = require('@sequelize/core');

const Bill_classificationService = {
  // 账单类别列表获取
  getBill_classificationList: async ({ category_type,classification_name }) => {
    try {
      // 定义查询条件对象 名称 编码 状态
      const whereClause = {};
      // 账单分类名称
      if (classification_name) {
        whereClause.classification_name = {
          [Op.like]: `${classification_name}%`
        };
      }
      // 账单类型
      if (category_type) {
        whereClause.category_type = {
          [Op.eq]: category_type
        };
      }
      const rows = await Bill_classificationModel.findAll({
        where: whereClause,
        raw: true
      });
      return rows;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 添加账单类别
  addBill_classification: async classification => {
    try {
      let result = await Bill_classificationModel.create(classification, {
        raw: true, // 返回原始数据而不是模型实例
        returning: true // 插入数据后返回那些字段（可指定，例['id']），参数可以是一个数组或者布尔值true，true返回所有字段
      });
      if (!result) return 'fail';
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 删除账单类别
  deleteBill_classification: async bill_classificationsToDelete => {
    try {
      let result = await Bill_classificationModel.destroy({
        where: {
          id: { [Op.in]: bill_classificationsToDelete }
        }
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 更新账单分类
  updateBill_classification: async (id, bill_classification) => {
    try {
      const result = await Bill_classificationModel.update(bill_classification, {
        where: { id },
        fields: ['classification_name', 'classification_icon', 'parent_id', 'sort', 'category_type'],
        raw: true
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

module.exports = Bill_classificationService;
