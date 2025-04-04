const { query } = require('express');
const ResourceService = require('../service/ResourceService');
const ApiResult = require('../utils/ApiResult');
const RouteConvert = require('../utils/RouteConvert');

const ResourceController = {
  // 返回所有资源数据
  getResourceList: async (req, res, next) => {
    try {
      let result;
      result = await ResourceService.getResourceList(req.query);
      if (JSON.parse(req.params.convert)) {
        result = RouteConvert.handleTreeOptimized(result);
      }
      if (!result) {
        res.send(ApiResult.Fail(400, '资源列表获取失败'));
      } else {
        res.send(ApiResult.Success(200, '获取成功', result));
      }
    } catch (error) {
      next(error);
    }
  },
  // 添加资源
  addResource: async (req, res, next) => {
    try {
      let result = await ResourceService.addResource(req.body);
      if (!result) {
        res.send(ApiResult.Fail(400, '添加失败'));
      } else {
        res.send(ApiResult.Success(200, '添加成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  },
  // 删除资源
  deleteResource: async (req, res, next) => {
    try {
      let result = await ResourceService.deleteResourceCascadeById(req.params.id);
      if (!result) {
        res.send(ApiResult.Fail(400, '删除失败'));
      } else {
        res.send(ApiResult.Success(200, '删除成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  },
  // 更新资源
  updateResource: async (req, res, next) => {
    try {
      let result = await ResourceService.updateResourceById(req.params.id, req.body);
      if (!result) {
        res.send(ApiResult.Fail(400, '更新失败'));
      } else {
        res.send(ApiResult.Success(200, '更新成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  },
  // 根据资源id返回资源数据
  getResourceListById: async (req, res, next) => {
    try {
      let resource = await ResourceService.getResourceListById(Object.values(req.query));
      let result = RouteConvert.handleTreeOptimized(resource, true);
      if (!result) {
        res.send(ApiResult.Fail(400, '资源列表获取失败'));
      } else {
        res.send(ApiResult.Success(200, '获取成功', result));
      }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ResourceController;
