const productModel = require("../models/product.model");
const jwt = require("jsonwebtoken");

// Add a new product
const addProduct = async (req, res) => {
  try {
    console.log("Cookies:", req.cookies);
    if (!req.cookies.token) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (jwt.verify(req.cookies.token, process.env.JWT_SECRET).role === "user") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const {
      name,
      description="No description provided",
      price,
      materials=["Not specified"],
      colorVariants=["Not specified"],
      sizeVariants=[
        {
          sizeName: "Default",
          sizeValue: 0,
          sizeUnit: "N/A",
        }],
      imageUrl="https://via.placeholder.com/150",
      videoUrls=["Not specified"],
      category="Uncategorized",
      stock=1,
    } = req.body;
    console.log(req.body);
    const sellerId = jwt.verify(req.cookies.token, process.env.JWT_SECRET).id;
    const newProduct = await productModel.create({
      name,
      description,
      price,
      materials,
      colorVariants,
      sizeVariants,
      imageUrl,
      videoUrls,
      category,
      stock,
      seller: sellerId,
    });

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addProduct,
};

// Get all products
