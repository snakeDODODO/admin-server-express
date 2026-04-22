var express = require('express');
const DebtController = require('../controller/DebtController')
var DebtRouter = express.Router();

DebtRouter.get('/api/debt/getdbtlistall', DebtController.getDebtListAll); 
DebtRouter.get('/api/debt/getdebtList', DebtController.getDebtList); 
DebtRouter.post('/api/debt/adddebt', DebtController.addDebt); 
DebtRouter.post('/api/debt/deletedebt',DebtController.deleteDebt);
DebtRouter.put('/api/debt/updatedebt/:id',DebtController.updateDebt);

module.exports = DebtRouter;