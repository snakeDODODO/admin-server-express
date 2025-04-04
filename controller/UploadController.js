const { createUploader, imageFileFilter, handleUploadError } = require('../utils/uploadConfig');
const UserService = require('../service/UserService');
const ApiResult = require('../utils/ApiResult');
const fs = require('fs');
const path = require('path');

// 创建头像上传中间件
const avatarUploader = createUploader({
  fieldName: 'avatar',
  uploadPath: 'public/uploads/avatars',
  fileFilter: imageFileFilter,
  fileSize: 5 * 1024 * 1024 // 5MB
});

const UploadController = {
  // 上传头像
  uploadAvatar: [
    avatarUploader,
    async (req, res, next) => {
      try {
        let file = req.file;
        if (!file) {
          return res.send(ApiResult.Fail(400, '文件上传失败'));
        }

        // 构建文件URL
        const fileUrl = `/uploads/avatars/${file.filename}`;

        // 获取用户ID (从请求参数或token中获取)
        const userId = req.params.id || req.query.userId || (req.user && req.user.id);

        if (!userId) {
          return res.send(ApiResult.Fail(400, '未提供用户ID，无法更新头像'));
        }

        // 获取用户当前信息，包括旧头像
        const currentUser = await UserService.getUserByInfomation(userId);
        let oldAvatarPath = null;

        // 如果用户存在且有旧头像，准备旧头像路径但暂不删除
        if (currentUser && currentUser.avatar) {
          // 从头像URL中提取文件名
          // 处理完整URL或相对路径
          if (currentUser.avatar.includes('://')) {
            // 完整URL，如 http://localhost:3000/uploads/avatars/avatar-xxx.jpg
            const urlParts = currentUser.avatar.split('/uploads/avatars/');
            if (urlParts.length > 1) {
              oldAvatarPath = urlParts[1];
            }
          } else if (currentUser.avatar.startsWith('/uploads/avatars/')) {
            // 相对路径，如 /uploads/avatars/avatar-xxx.jpg
            oldAvatarPath = currentUser.avatar.substring('/uploads/avatars/'.length);
          } else {
            // 直接是文件名，如 avatar-xxx.jpg
            oldAvatarPath = currentUser.avatar;
          }
        }

        // 调用UserService更新用户头像
        const updateResult = await UserService.changeUserAvatar(userId, fileUrl);

        if (!updateResult) {
          // 如果更新失败，删除刚上传的新头像
          const newAvatarPath = path.join(__dirname, '../public/uploads/avatars', file.filename);
          if (fs.existsSync(newAvatarPath)) {
            fs.unlinkSync(newAvatarPath);
          }
          return res.send(ApiResult.Fail(500, '更新用户头像信息失败'));
        }

        // 数据库更新成功后，删除旧头像文件
        if (oldAvatarPath) {
          const fullPath = path.join(__dirname, '../public/uploads/avatars', oldAvatarPath);
          // 检查文件是否存在，存在则删除
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }

        // 返回文件信息
        res.send(
          ApiResult.Success(200, '头像上传成功', {
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: fileUrl
          })
        );
      } catch (error) {
        // 发生异常时，尝试删除已上传的文件
        if (req.file) {
          const filePath = path.join(__dirname, '../public/uploads/avatars', req.file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        next(error);
      }
    }
  ],

  // 处理上传错误
  handleUploadError: (err, req, res, next) => {
    handleUploadError(err, req, res, next, ApiResult);
  }
};

module.exports = UploadController;
