const express = require("express");
const {
  createCategories,
  getAllCategories,
  getDetailCategories,
  updateCategories,
  deleteCategories,
} = require("../controllers/categories.controllers");

const categoriesRouter = express.Router();

categoriesRouter.post("/", createCategories);
categoriesRouter.get("/", getAllCategories);
categoriesRouter.get("/:id", getDetailCategories);
categoriesRouter.put("/:id", updateCategories);
categoriesRouter.delete("/:id", deleteCategories);

module.exports = {
  categoriesRouter,
};
