const express = require("express");
const {
  createCarts,
  getAllCarts,
  getDetailCarts,
  updateCarts,
  deleteCarts,
  getAllCartsbyUserId,
  CheckoutCarts,
} = require("../controllers/carts.controllers");
const { paymentVNPAY, checkPaymentVNPAY } = require("../services/vnpay");

const cartsRouter = express.Router();

cartsRouter.post("/", createCarts);
cartsRouter.get("/:userid", getAllCartsbyUserId);
// cartsRouter.get("/:id", getDetailCarts);
cartsRouter.put("/:id", updateCarts);
cartsRouter.delete("/:id", deleteCarts);
cartsRouter.post("/checkout", CheckoutCarts);

module.exports = {
  cartsRouter,
};
