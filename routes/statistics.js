var express = require('express');
const StatisticsController = require('../controller/StatisticsController')
var StatisticsRouter = express.Router();

StatisticsRouter.get('/api/statistics/getaccountbalance', StatisticsController.getAccountBalance);
StatisticsRouter.get('/api/statistics/getbilllistbyshowtable', StatisticsController.getBillListByShowTable);
StatisticsRouter.get('/api/statistics/getbillbyweek', StatisticsController.getBillByWeek);
StatisticsRouter.get('/api/statistics/getyearlyincomeexpenses', StatisticsController.getYearlyIncomeExpenses);
StatisticsRouter.get('/api/statistics/getyearlyie', StatisticsController.getYearlyIE);

module.exports = StatisticsRouter;