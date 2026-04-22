var express = require('express');
const Bill_classificationController = require('../controller/Bill_classificationController')
var Bill_classificationRouter = express.Router();

Bill_classificationRouter.get('/api/bill_classification/getbill_classificationList', Bill_classificationController.getBill_classificationList); 
Bill_classificationRouter.post('/api/bill_classification/addBill_classification', Bill_classificationController.addBill_classification); 
Bill_classificationRouter.post('/api/bill_classification/deletebill_classification',Bill_classificationController.deleteBill_classification);
Bill_classificationRouter.put('/api/bill_classification/updatebill_classification/:id',Bill_classificationController.updateBill_classification);

module.exports = Bill_classificationRouter;