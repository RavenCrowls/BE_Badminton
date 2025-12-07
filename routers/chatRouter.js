const express = require('express');
const { handleChat } = require('../controllers/chatController');

const chatRouter = express.Router();

chatRouter.post('/', handleChat);

module.exports = {
  chatRouter
};
