var express = require('express');
const MessageController = require('../controller/MessageController');
var MessageDataRouter = express.Router();

// 获取信息列表
MessageDataRouter.get('/api/message/getmessagelist/:id', MessageController.getMessageList);
// 发送信息
// MessageDataRouter.post('/api/message/sendmessage', MessageController.sendMessage);
// 删除信息
MessageDataRouter.post('/api/message/deletemessage', MessageController.deleteMessage);
// 信息已读
MessageDataRouter.post('/api/message/updatemessagestatus', MessageController.updateMessageStatus);
// 已读全部信息
MessageDataRouter.put('/api/message/updatemessageall/:id', MessageController.updateMessageAll);

module.exports = MessageDataRouter;
