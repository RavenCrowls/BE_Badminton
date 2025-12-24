const express = require('express');
const { handleChat, getListConversations, getChatHistory } = require('../controllers/chat.controller');

const chatRouter = express.Router();

chatRouter.post('/', handleChat);
chatRouter.get('/', getListConversations);
chatRouter.get('/:room', getChatHistory);

module.exports = {
  chatRouter
};
