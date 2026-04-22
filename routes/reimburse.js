var express = require('express');
const ReimburseController = require('../controller/ReimburseController')
var ReimburseRouter = express.Router();

ReimburseRouter.get('/api/reimburse/getreimburselistall', ReimburseController.getReimburseListAll); 
ReimburseRouter.get('/api/reimburse/getreimburseList', ReimburseController.getReimburseList); 
ReimburseRouter.post('/api/reimburse/addreimburse', ReimburseController.addReimburse); 
ReimburseRouter.post('/api/reimburse/deletereimburse',ReimburseController.deleteReimburse);
ReimburseRouter.put('/api/reimburse/updatereimburse/:id',ReimburseController.updateReimburse);

module.exports = ReimburseRouter;