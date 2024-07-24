var express = require('express');
const AuthController = require('../controller/AuthController')
var AuthRouter = express.Router();

/* GET users listing. */
AuthRouter.get('/api/auth/list/:id', AuthController.AuthResourceList); // 权限接口

module.exports = AuthRouter;