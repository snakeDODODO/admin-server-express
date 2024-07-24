var express = require('express');
const ResourceController = require('../controller/ResourceController')
var ResourceRouter = express.Router();

/* GET users listing. */
ResourceRouter.get('/api/resource/getresourcelist/:convert',ResourceController.getResourceList); // 获取资源列表
ResourceRouter.get('/api/resource/getresourcelistbyid',ResourceController.getResourceListById); // 根据id获取资源列表
ResourceRouter.post('/api/resource/addresource',ResourceController.addResource); // 添加资源
ResourceRouter.delete('/api/resource/deleteresource/:id',ResourceController.deleteResource);// 删除资源
ResourceRouter.put('/api/resource/updateresource/:id',ResourceController.updateResource); // 更新资源

module.exports = ResourceRouter;