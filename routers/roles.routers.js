const express = require("express");
const {
  createRoles,
  getAllRoles,
  getDetailRoles,
  updateRoles,
  deleteRoles,
} = require("../controllers/roles.controllers");

const roleRouter = express.Router();

roleRouter.post("/", createRoles);
roleRouter.get("/", getAllRoles);
roleRouter.get("/:id", getDetailRoles);
roleRouter.put("/:id", updateRoles);
roleRouter.delete("/:id", deleteRoles);

module.exports = {
  roleRouter,
};
