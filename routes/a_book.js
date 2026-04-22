var express = require('express');
const A_BookController = require('../controller/A_BookController')
var A_BookRouter = express.Router();

A_BookRouter.get('/api/abook/getabooklistall', A_BookController.getA_BookListAll); 
A_BookRouter.get('/api/abook/getabooklist', A_BookController.getA_BookList); // (带参)
A_BookRouter.post('/api/abook/addabook', A_BookController.addA_Book); 
A_BookRouter.post('/api/abook/deleteabook',A_BookController.deleteA_Book);
A_BookRouter.put('/api/abook/updateabook/:id',A_BookController.updateA_Book);

module.exports = A_BookRouter;