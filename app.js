var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const JWT = require('./utils/JWT');
// 引入跨域处理中间件
const cors = require('cors');
const http = require('http');
const { initWebSocketServer } = require('./utils/websocket');

// 加载路由模块
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var resourceRouter = require('./routes/resource');
var roleRouter = require('./routes/role');
var dictionaryRouter = require('./routes/dictionary');
var dictionaryDataRouter = require('./routes/dictionarydata');
var department = require('./routes/department');
var bill_classification = require('./routes/bill_classification');
var bill = require('./routes/bill');
var account = require('./routes/account');
var aclass = require('./routes/a_class');
var abook = require('./routes/a_book');
var statistics = require('./routes/statistics');
var reimburse = require('./routes/reimburse');
var debt = require('./routes/debt');
var transfer = require('./routes/transfer');
var upload = require('./routes/upload');
var notification = require('./routes/notice');
var message = require('./routes/message');

var app = express();

// cors配置项
let corsOptions = {
  // 配置允许访问的暴露header自定义属性，否则访问不到token
  exposedHeaders: ['Authorization'],
  // 配置访问允许携带的cookie
  credentials: true,
  // 成功请求返回的状态码
  optionsSuccessStatus: 200
};

// 调用中间库
// 跨域处理中间件
app.use(cors(corsOptions));
app.options('*', cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 托管静态目录
app.use(express.static(path.join(__dirname, 'public')));

// 跨域
// app.all("*",function(req,res,next) {
//   // 设置允许跨域的域名，*代表允许任意域名跨域
//   res.header('Access-Control-Allow-Origin','*')
//   // 允许的header类型
//   res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method' )
//   // 跨域的允许的请求方式
//   res.header('Access-Control-Allow-Methods','DELETE,PUT,POST,GET,OPTIONS');
//   设置允许发送的header头信息
//   res.header('Access-Control-Expose-Headers','Authorization')
//   res.header('Access-Control-Allow-Credential','true')
//   // 为所有的复杂预检请求放行，否则无法得到回应
//   if(req.method.toLocaleLowerCase() == 'options'){
//     res.send(200)
//   }else {
//     next()
//   }
// })

// 设置中间件验证token (所有的后续逻辑不通过token验证就不放行)
app.use((req, res, next) => {
  // 如果token有效 ,next()
  // 如果token过期了, 返回401错误
  /*
    首先排除登录接口(因为登录接口没有token)
  */
  if (req.url === '/api/user/login') {
    next();
    return;
  }
  const token = req.headers['authorization'];
  // token解析
  if (token !== undefined || token !== null) {
    // 校验token
    let payload = JWT.verify(token);
    if (payload) {
      // 每一次请求，重新生成新的token用来延续时间
      let newToken = JWT.generate(
        {
          _id: payload._id,
          username: payload.username
        },
        '7d'
      );
      res.header('Authorization', newToken);
      next();
    } else {
      console.log('3');
      // token验证失败则返回错误信息
      res.status(401).send({ errCode: '-1', errorInfo: 'token过期或无效' });
    }
  }
});

// 将路由添加到请求处理链中
app.use(indexRouter);
app.use(usersRouter);
app.use(authRouter);
app.use(resourceRouter);
app.use(roleRouter);
app.use(dictionaryRouter);
app.use(dictionaryDataRouter);
app.use(department);
app.use(bill_classification);
app.use(bill);
app.use(account);
app.use(aclass);
app.use(abook);
app.use(statistics);
app.use(reimburse);
app.use(debt);
app.use(transfer);
app.use(upload);
app.use(notification);
app.use(message);

// 配置静态文件服务，使上传的文件可以通过URL访问
app.use(express.static(path.join(__dirname, 'public')));

// 处理404【路由匹配不到情况】
app.use(function (req, res, next) {
  next(createError(404));
});

// 全局错误响应
app.use(function (err, req, res, next) {
  // 设置局部变量，只在开发模式中显示错误
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.error(err.stack);
  // 加载错误页面
  res.status(err.status || 500).send('服务器错误');
});

// 这里是真实的应用入口，被导出是因为实际入口文件不是这个，这里会被加载然后启动服务
module.exports = app;

// 创建HTTP服务器
// 移除以下代码
// 创建HTTP服务器
// const server = http.createServer(app);

// 初始化WebSocket服务器
// initWebSocketServer(server);

// 修改监听方式，使用HTTP服务器而不是Express应用
// server.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// 保留原始的导出
module.exports = app;
