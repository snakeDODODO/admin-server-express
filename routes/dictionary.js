var express = require('express');
const DictionaryController = require('../controller/DictionaryController')
var DictionaryRouter = express.Router();

/* GET users listing. */
DictionaryRouter.get('/api/dictionary/getdictionaryall',DictionaryController.getDictionaryAll); // 获取字典列表
DictionaryRouter.post('/api/dictionary/adddictionary',DictionaryController.addDictionary); // 添加字典
DictionaryRouter.post('/api/dictionary/deletedictionary',DictionaryController.delDictionaryById);// 删除字典
DictionaryRouter.put('/api/dictionary/updatedictionary/:id',DictionaryController.updateDictionary); // 更新字典
DictionaryRouter.put('/api/dictionary/changedictionarystatus/:id',DictionaryController.changeDictionaryStatus); // 更新字典状态

module.exports = DictionaryRouter;