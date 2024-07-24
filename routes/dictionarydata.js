var express = require('express');
const DictionaryDataController = require('../controller/DictionaryDataController')
var DictionaryDataRouter = express.Router();

/* GET users listing. */
DictionaryDataRouter.get('/api/dictionary/getdictionarydataall',DictionaryDataController.getDictionaryDataAllById); // 获取字典数据列表
DictionaryDataRouter.post('/api/dictionary/adddictionarydata',DictionaryDataController.addDictionaryData); // 添加字典数据
DictionaryDataRouter.post('/api/dictionary/deletedictionarydata',DictionaryDataController.delDictionaryDataById);// 删除字典数据
DictionaryDataRouter.put('/api/dictionary/updatedictionarydata/:id',DictionaryDataController.updateDictionaryData); // 更新字典数据
DictionaryDataRouter.put('/api/dictionary/changedictionarydatastatus/:id',DictionaryDataController.changeDictionaryDataStatus); // 更新字典数据状态

module.exports = DictionaryDataRouter;