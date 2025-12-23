const express = require('express');
const { handleChat } = require('../controllers/chat.controller');

const chatRouter = express.Router();

chatRouter.post('/', handleChat);

module.exports = {
  chatRouter
};
