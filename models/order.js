const mongoose = require("mongoose");

// mongoose.Schema.Types.ObjectId
// mongoose.Schema.ObjectId

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      postalCode: {
        type: Number,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      phoneNo: {
        type: Number,
        required: true,
      },
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    paymentInfo: {
      id: {
        type: String,
      },
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    shippingAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: Number,
      required: true,
      default: "processing",
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
