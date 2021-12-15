const Order = require("../models/order");
const Product = require("../models/product");

const BigPromise = require("../middlewares/bigPromise");

exports.createOrder = BigPromise((req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getOrder = BigPromise((req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "User",
    "name email"
  );

  if (!order) {
    return next(new Error("order not found..."));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getLoggedInOrders = BigPromise((req, res, next) => {
  const order = await Order.find({ user: req.user._id });

  if (!order) {
    return next(new Error("order not found"));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.adminOrders = BigPromise((req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.adminUpdateOrder = BigPromise((req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus === "delivered") {
    return next(new Error("order is already marked for delivery"));
  }

  order.orderStatus = req.body.orderStatus;

  order.orderItems.forEach(async (prod) => {
    await updateProductStock(prod.product, prod.quantity);
  });

  await order.save();

  res.status(200).json({
    success: true,
  });
});

exports.adminDeleteOrder = BigPromise((req, res, next) => {
  const order = await Order.findById(req.params.id);

  await order.remove();

  res.status(200).json({
    success: true,
  });
});

async function updateProductStock(productId, quantity) {
  const product = await Product.findById(productId);

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}
