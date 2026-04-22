var express = require('express');
const AccountController = require('../controller/AccountController')
var AccountsRouter = express.Router();

AccountsRouter.get('/api/account/getaccountlistall', AccountController.getAccountListAll); 
AccountsRouter.get('/api/account/getaccountList', AccountController.getAccountList); 
AccountsRouter.post('/api/account/addaccount', AccountController.addAccount); 
AccountsRouter.post('/api/account/deleteaccounts',AccountController.deleteAccounts);
AccountsRouter.put('/api/account/updateaccount/:account_id',AccountController.updateAccount);
AccountsRouter.get('/api/account/getaccountbalance/:accountId',AccountController.getAccountBalance);


module.exports = AccountsRouter;