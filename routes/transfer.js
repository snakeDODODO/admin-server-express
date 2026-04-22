var express = require('express');
const TransferController = require('../controller/TransferController')
var TransferRouter = express.Router();

TransferRouter.get('/api/transfer/gettransferlistall', TransferController.getTransferListAll); 
TransferRouter.get('/api/transfer/gettransferList', TransferController.getTransferList); 
TransferRouter.post('/api/transfer/addtransfer', TransferController.addTransfer); 
TransferRouter.post('/api/transfer/deletetransfer',TransferController.deleteTransfer);
TransferRouter.put('/api/transfer/updatetransfer/:id',TransferController.updateTransfer);

module.exports = TransferRouter;