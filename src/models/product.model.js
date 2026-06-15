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
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  adminApproval: {
    type: Boolean,
    default: false,
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
// 
/*
{
```json
  "name": "Premium Wireless Headphones",
  "description": "High-fidelity audio with active noise cancellation and 30 hours of battery life.",
  "price": 299.99,
  "category": "Electronics",
  "image": "https://example.com/images/headphones.jpg",
  "stock": 45,
  "comments": [
    {
      "username": "john_doe",
      "userid": "60d5ec8576c44e001f8b4567",
      "rating": 5,
      "text": "Great sound quality and battery life!",
      "createdAt": "2023-10-27T10:00:00.000Z"
    }
  ],
  "likes": [
    "60d5ec8576c44e001f8b4567",
    "60d5ec8576c44e001f8b4568"
  ],
  "createdAt": "2023-10-25T08:30:00.000Z"
```

}
*/

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;