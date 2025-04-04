const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 配置存储
const createStorage = uploadPath => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      // 确保上传目录存在
      const uploadDir = path.join(__dirname, '..', uploadPath);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      // 生成唯一文件名
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
};

// 文件过滤器
const imageFileFilter = (req, file, cb) => {
  // 只接受图片文件
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传JPG、PNG、GIF或WEBP格式的图片!'), false);
  }
};

// 创建上传配置
const createUploader = options => {
  const {
    fieldName = 'file',
    uploadPath = 'public/uploads',
    fileFilter = null,
    fileSize = 5 * 1024 * 1024 // 默认5MB
  } = options;

  const storage = createStorage(uploadPath);

  const uploader = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: fileSize
    }
  });

  return uploader.single(fieldName);
};

// 处理上传错误
const handleUploadError = (err, req, res, next, ApiResult) => {
  if (err instanceof multer.MulterError) {
    // Multer错误处理
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.send(ApiResult.Fail(400, '文件大小超过限制'));
    }
    return res.send(ApiResult.Fail(400, `上传错误: ${err.message}`));
  } else if (err) {
    // 其他错误
    return res.send(ApiResult.Fail(400, err.message));
  }
  next();
};

module.exports = {
  createUploader,
  imageFileFilter,
  handleUploadError
};
