const express = require('express');
const router = express.Router();
const UploadController = require('../controller/UploadController');

// 上传头像路由
router.post('/api/upload/avatar/:id', UploadController.uploadAvatar);

// 错误处理中间件应该在路由之后
router.use(UploadController.handleUploadError);

module.exports = router;
