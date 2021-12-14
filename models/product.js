const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: [120, "product name should be lesser then 120 characters..."],
      required: [true, "product name is required..."],
      trim: true,
    },
    price: {
      type: String,
      maxlength: [6, "product price should be lesser then 6 digits..."],
      required: [true, "product price is required..."],
    },
    description: {
      type: String,
      required: [true, "product description required..."],
    },
    photos: [
      {
        id: {
          type: String,
          required: true,
        },
        secure_url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [
        true,
        "select categories from shortsleeves, longsleeves, sweatshirts, hoodies",
      ],
      enum: {
        values: ["shortsleeves", "longsleeves", "sweatshirts", "hoodies"],
        message:
          "select categories from shortsleeves, longsleeves, sweatshirts, hoodies",
      },
    },
    brand: {
      type: String,
      required: [true, "brand required..."],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
