const express = require("express");
const router = express.Router();

const { isLoggedIn, customRole } = require("../middlewares/user");
const {
  createOrder,
  getOrder,
  getLoggedInOrders,
  adminOrders,
  adminUpdateOrder,
  adminDeleteOrder,
} = require("../controllers/orderController");

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/ord/userord").get(isLoggedIn, getLoggedInOrders);

router.route("/order/:id").get(isLoggedIn, getOrder);

// admin
router.route("/admin/orders").get(isLoggedIn, customRole("admin"), adminOrders);
router
  .route("/admin/order/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateOrder)
  .delete(isLoggedIn, customRole("admin"), adminDeleteOrder);

module.exports = router;
