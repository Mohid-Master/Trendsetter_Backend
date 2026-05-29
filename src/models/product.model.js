const mongoose = require("mongoose");
const { search } = require("../app");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  materials: {
    type: [String],
  },
  colorVariants: {
    type: [String],
  },
  sizeVariants: {
    type: [
      {
        sizeName: String,
        sizeValue: Number,
        sizeUnit: String,
      },
    ],
  },

  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imageUrls: {
    type: [String],
  },
  videoUrls: {
    type: [String],
  },
  stock: {
    type: Number,
    required: true,
  },
  searchTags: {
    type: [String],
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [
    {
      username: {
        type: String,
        required: true,
      },
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;