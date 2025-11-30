const express = require('express');
const {
	createOrderDetail,
	getAllOrderDetails,
	getOrderDetailById,
	updateOrderDetail,
	deleteOrderDetail
} = require('../controllers/orderdetails.controllers');

const orderdetailRouter = express.Router();

orderdetailRouter.post('/', createOrderDetail);
orderdetailRouter.get('/:orderid', getAllOrderDetails);
orderdetailRouter.get('/:orderid/:id', getOrderDetailById);
orderdetailRouter.put('/:orderid/:id', updateOrderDetail);
orderdetailRouter.delete('/:orderid/:id', deleteOrderDetail);

module.exports = { orderdetailRouter };
