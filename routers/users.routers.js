const express = require("express");
const {
  createUsers,
  getAllUsers,
  getDetailUsers,
  updateUsers,
  deleteUsers,
  login,
  getDetailUsersByUsername,
  changePassword,
  forgotPassword,
} = require("../controllers/users.controllers");
const { authenticate } = require("../middlewares/auth/authenticate");
const { handlechat } = require("../services/chatbot");

const usersRouter = express.Router();

usersRouter.post("/", createUsers);
usersRouter.post("/login", login);
usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", getDetailUsers);
usersRouter.put("/:id", updateUsers);
usersRouter.delete("/:id", deleteUsers);
usersRouter.get("/username/:username", getDetailUsersByUsername);
usersRouter.post("/changepass", authenticate, changePassword);
usersRouter.post("/forgotpass", forgotPassword);
usersRouter.post("/chatbot", handlechat);

module.exports = {
  usersRouter,
};
