const express = require("express");
const uploadCloud = require("../middlewares/upload/cloudinary");
const {
  createImageUser,
  changeImageUser,
} = require("../controllers/imagesuser.controllers");

const imguserRouter = express.Router();

imguserRouter.post("/", uploadCloud.single("image"), createImageUser);
imguserRouter.put("/:userid", uploadCloud.single("image"), changeImageUser);

module.exports = {
  imguserRouter,
};
