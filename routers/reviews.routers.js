const express = require("express");
const {
  createReviews,
  deleteReviews,
  updateReviews,
  getDetailReviews,
  getAllReviewsbyProductid,
} = require("../controllers/reviews.controllers");

const reviewsRouter = express.Router();

reviewsRouter.post("/", createReviews);
reviewsRouter.get("/:productid", getAllReviewsbyProductid);
// reviewsRouter.get("/:id", getDetailReviews);
reviewsRouter.put("/:id", updateReviews);
reviewsRouter.delete("/:id", deleteReviews);

module.exports = {
  reviewsRouter,
};
