const ResourceModel = require('../models/ResourceModule');
const sequelize = require('../config/db.config');
const { Op } = require('@sequelize/core');

const ResourceService = {
  // 获取所有资源数据
  getResourceList: async ({ title, hidden }) => {
    try {
      // 定义查询条件对象
      const whereClause = {};
      if (title) {
        whereClause.title = {
          [Op.like]: `${title}%`
        };
      }
      if (hidden) {
        whereClause.hidden = {
          [Op.eq]: hidden
        };
      }
      let resources = await ResourceModel.findAll({
        where: whereClause
      });
      return resources.map(resource => resource.toJSON());
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 添加资源
  addResource: async resource => {
    try {
      let result = await ResourceModel.create(resource);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 根据ID删除资源数据，包括子资源
  deleteResourceCascadeById: async id => {
    // 自动开启托管事物
    try {
      const result = await sequelize.transaction(async t => {
        // 删除子资源
        await ResourceModel.destroy(
          {
            where: {
              parent_id: id
            }
          },
          { transaction: t }
        );

        // 删除父资源
        const resource = await ResourceModel.destroy(
          {
            where: {
              id
            }
          },
          { transaction: t }
        );
        return resource;
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }

    // 手动开启非托管事物
    // const transaction = await sequelize.startUnmanagedTransaction()

    // try {
    //   // 删除子资源
    //   await ResourceModel.destroy({
    //     where: {
    //       parent_id: id,
    //     },
    //   },transaction)

    //   // 删除父资源
    //   const result = await ResourceModel.destroy({
    //     where: {
    //       id,
    //     },
    //   },transaction)

    //   await transaction.commit()

    //   return result
    // } catch (error) {
    //   await transaction.rollback()
    //   throw error
    // }
  },
  // 根据ID修改资源数据
  updateResourceById: async (id, updatedData) => {
    try {
      const result = await ResourceModel.update(updatedData, {
        where: {
          id
        }
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // 根据资源id获取资源数据
  getResourceListById: async id => {
    try {
      let result = await ResourceModel.findAll({
        where: {
          id
        },
        raw: true
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

module.exports = ResourceService;
