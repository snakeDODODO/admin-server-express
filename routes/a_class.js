var express = require('express');
const A_ClassController = require('../controller/A_ClassController')
var A_ClassRouter = express.Router();

A_ClassRouter.get('/api/aclass/getaclassListall', A_ClassController.getA_ClassListAll); 
A_ClassRouter.get('/api/aclass/getaclassList', A_ClassController.getA_ClassList); // (带参)
A_ClassRouter.post('/api/aclass/addaclass', A_ClassController.addA_Class); 
A_ClassRouter.post('/api/aclass/deleteaclass',A_ClassController.deleteA_Class);
A_ClassRouter.put('/api/aclass/updateaclass/:id',A_ClassController.updateA_Class);

module.exports = A_ClassRouter;