var express = require('express');
const BillController = require('../controller/BillController')
var BillRouter = express.Router();

BillRouter.get('/api/bill/getbillList', BillController.getBillList); 
BillRouter.post('/api/bill/addbill', BillController.addBill); 
BillRouter.post('/api/bill/deletebill',BillController.deleteBill);
BillRouter.put('/api/bill/updatebill/:id',BillController.updateBill);

module.exports = BillRouter;