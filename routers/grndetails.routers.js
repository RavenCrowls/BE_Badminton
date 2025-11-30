const express = require('express');
const {
	createGRNDetails,
	getlistGRNDetails,
	getGRNDetailsById,
	updateGRNDetails,
	deleteGRNDetails
} = require('../controllers/grndetails.controllers');

const grndetailsRouter = express.Router();

grndetailsRouter.post('/', createGRNDetails);
grndetailsRouter.get('/:grnid', getlistGRNDetails);
grndetailsRouter.get('/:grnid/:id', getGRNDetailsById);
grndetailsRouter.put('/:grnid/:id', updateGRNDetails);
grndetailsRouter.delete('/:grnid/:id', deleteGRNDetails);

module.exports = {
	grndetailsRouter
};
