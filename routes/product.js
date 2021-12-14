const express = require("express");
const router = express.Router();

// custom middlewares
const { isLoggedIn, customRole } = require("../middlewares/user");
// controllers
const {
  addProduct,
  getProducts,
  adminGetProducts,
  getProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  addReview,
  deleteReview,
  getReviewsForProduct,
} = require("../controllers/productController");

// user
router.route("/products").get(getProducts);
router.route("/product/:id").get(getProduct);
router
  .route("/review")
  .put(isLoggedIn, addReview)
  .delete(isLoggedIn, deleteReview);
router.route("/reviews").get(isLoggedIn, getReviewsForProduct);

// admin
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);
router
  .route("/admin/products")
  .get(isLoggedIn, customRole("admin"), adminGetProducts);
router
  .route("/admin/product/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateProduct)
  .delete(isLoggedIn, customRole("admin"), adminDeleteProduct);

module.exports = router;
