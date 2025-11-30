const express = require('express');
const { grnRouter } = require('./grn.routers');
const { grndetailsRouter } = require('./grndetails.routers');
const { orderRouter } = require('./orders.routers');
const { orderdetailRouter } = require('./orderdetails.routers');

const rootRouter = express.Router();

rootRouter.use('/grns', grnRouter);
rootRouter.use('/grndetails', grndetailsRouter);
rootRouter.use('/orders', orderRouter);
rootRouter.use('/orderdetails', orderdetailRouter);

module.exports = {
	rootRouter
};
