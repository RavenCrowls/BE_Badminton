const express = require("express");
const {
  createPayment,
  checkPaymentVNPAY,
  checkPaymentPaypal,
} = require("../controllers/payment.controllers");

const paymentRouter = express.Router();

paymentRouter.post("/create-qr", createPayment);
paymentRouter.get("/check-payment-vnpay", checkPaymentVNPAY);
paymentRouter.get("/paypal/check-payment-paypal", checkPaymentPaypal);

module.exports = paymentRouter;
