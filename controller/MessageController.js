const MessageSerivce = require('../service/MessageSerivce');
const ApiResult = require('../utils/ApiResult');

const MessageController = {
  // 查询部门列表数据
  getMessageList: async (req, res, next) => {
    try {
      let result;
      result = await MessageSerivce.getMessageList(req.params.id, req.query);
      if (!result) {
        res.send(ApiResult.Fail(400, '消息列表获取失败'));
      } else {
        res.send(ApiResult.Success(200, '消息列表获取成功', result));
      }
    } catch (error) {
      next(error);
    }
  },
  // 删除信息
  deleteMessage: async (req, res, next) => {
    try {
      let result = await MessageSerivce.deleteMessage(req.body);
      if (result === 0) {
        res.send(ApiResult.Fail(400, '删除信息失败'));
      } else {
        res.send(ApiResult.Success(200, '删除信息成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  },
  // 信息已读
  updateMessageStatus: async (req, res, next) => {
    try {
      const result = await MessageSerivce.updateMessage(req.body);
      if (!result) {
        res.send(ApiResult.Fail(400, '信息状态更新失败'));
      } else {
        res.send(ApiResult.Success(200, '信息状态更新成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  },
  // 全部已读
  updateMessageAll: async (req, res, next) => {
    try {
      const result = await MessageSerivce.updateMessageAll(req.params.id);
      if (!result) {
        res.send(ApiResult.Fail(400, '信息状态更新失败'));
      } else {
        res.send(ApiResult.Success(200, '信息状态更新成功', 'success'));
      }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = MessageController;
