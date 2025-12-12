const express = require("express");
const uploadCloud = require("../middlewares/upload/cloudinary");
const {
  createImageProduct,
  deleteImageProduct,
} = require("../controllers/imagesproduct.controllers");

const imgproductRouter = express.Router();

imgproductRouter.post("/", uploadCloud.single("image"), createImageProduct);
imgproductRouter.delete("/:id", deleteImageProduct);

module.exports = {
  imgproductRouter,
};
