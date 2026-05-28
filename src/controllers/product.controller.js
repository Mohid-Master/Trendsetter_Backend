const productModel = require("../models/product.model");

// ==========================================
// 1. ADD NEW PRODUCT
// ==========================================
const addProduct = async (req, res) => {
  try {
    // Rely on Mongoose Schema defaults instead of massive destructuring defaults here
    const productData = {
      ...req.body,
      seller: req.user.id // Provided cleanly by isAuthenticated middleware
    };

    const newProduct = await productModel.create(productData);

    res.status(201).json({ 
      message: "Product added successfully", 
      product: newProduct 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================================
// 2. GET ALL PRODUCTS
// ==========================================
const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find().populate("seller", "name email");
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================================
// 3. GET PRODUCT BY ID
// ==========================================
const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id).populate("seller", "name email");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================================
// 4. UPDATE PRODUCT
// ==========================================
const updateProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Authorization check: Does this seller own the product?
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: You do not own this product" });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================================
// 5. DELETE PRODUCT
// ==========================================
const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Authorization check: Does this seller own the product?
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: You do not own this product" });
    }

    await productModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};