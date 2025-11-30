const express = require('express');
const {
	createGRN,
	getAllGRNs,
	getGRNById,
	updateGRN,
	deleteGRN,
	getTotalGRNAmount
} = require('../controllers/grn.controllers');

const grnRouter = express.Router();

grnRouter.post('/', createGRN);
grnRouter.get('/', getAllGRNs);
grnRouter.get('/:id', getGRNById);
grnRouter.put('/:id', updateGRN);
grnRouter.delete('/:id', deleteGRN);
grnRouter.get('/total/time', getTotalGRNAmount);

module.exports = {
	grnRouter
};
