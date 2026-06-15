const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const userModel = require("../models/user.model");



const placeOrder = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // const demoproducts = [{
        //     product: product._id,
        //     seller: product.seller,
        //     quantity: product.quantity,
        //     selectedVariants: product.selectedVariants,
        // }];
        const order = await orderModel.create({
            user: user._id,
            products: req.body.products,
            totalAmount: req.body.totalAmount,
        });
        return res.status(200).json({ message: "Order placed successfully", order });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const cancelOrder = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (!order.user == req.user.id) {
            return res.status(403).json({ message: "You are not authorized to cancel this order" });
        }
        if (order.status == "cancelled") {
            return res.status(400).json({ message: "Order is already cancelled" });
        }
        if (order.status == "delivered") {
            return res.status(400).json({ message: "Order is already delivered" });
        }
        if (order.status == "shipped") {
            return res.status(400).json({ message: "Order is already shipped" });
        }
        if (order.status == "out for delivery") {
            return res.status(400).json({ message: "Order is already out for delivery" });
        }
        const updatedOrder = await orderModel.findByIdAndUpdate(req.params.id, { status: "cancelled" }, { new: true });
        return res.status(200).json({ message: "Order cancelled successfully", order: updatedOrder });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
// ==========================================
// 6. comment
// ==========================================
const commentProduct = async (req, res) => {
    try {
        if (!req.body.text || !req.body.rating) {
            return res.status(400).json({ message: "Text and rating are required" });
        }
        const user = await userModel.findById(req.user.id);
        console.log(user, req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        console.log(product.comments.find(comment => comment.userid) == user._id, "comment data");
        if (!(product.comments.find(comment => comment.userid) == user._id)) {
            return res.status(400).json({ message: "You have already commented on this product" });
        }
        const comment = await productModel.findByIdAndUpdate(req.params.id, {
            comments: [...product.comments, {
                username: user.name,
                userid: user._id,
                text: req.body.text,
                rating: req.body.rating,
            }],
        },
            { new: true }
        );
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        return res.status(200).json({ message: "Comment added successfully", comments: product.comments });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// ==========================================
// 7. like product
// ==========================================
const likeProduct = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!req.params.id) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (!(product.likes.find(like => like.userid) == user._id)) {
            return res.status(400).json({ message: "You have already liked this product" });
        }
        await productModel.findByIdAndUpdate(req.params.id, {
            likes: [...product.likes, user._id],
        });
        return res.status(200).json({ message: "Product liked successfully", product: product });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// ==========================================
// 8. get all orders
// ==========================================
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ user: req.user.id });
        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// ==========================================
// 4.get all order for eachseller products
// ==========================================
const getAllOrdersForEachSellerProducts = async (req, res) => {
    try {
        const sellerId = req.user.id; // From your auth middleware
        // Query directly inside the array of objects using dot notation
        const orders = await orderModel.find({ "products.seller": sellerId })
            .populate("user", "name email")
            .populate("products.product", "name price imageUrl materials colorVariants sizeVariants");

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for your products." });
        }
        //   console.log(orders,"orders");
        // Optional but Highly Recommended: Filter out other sellers' items from the response
        const formattedOrders = orders.map(order => {
            const orderObj = order.toObject();

            // Only keep the items that belong to THIS logged-in seller
            orderObj.products = orderObj.products.filter(item => item.seller.toString() === sellerId);

            return orderObj;
        });
        //   change total amount according to the products of these seller
        // const totalAmount = orders.reduce((acc, order) => {
        //     return acc + order.products.reduce((acc, product) => {
        //         return acc + product.price * product.quantity;
        //     }, 0) * order.products.length;
        // }, 0);  
        formattedOrders.forEach(order => {
            let totalAmount = 0;
            order.products.forEach(product => {
                // console.log(product.product.price * product.quantity)
                totalAmount += product.product.price * product.quantity;

            })
            order.totalAmount = totalAmount;
            console.log(totalAmount)
        })
        // formattedOrders.products.forEach(product => {

        // });
        // formattedOrders.totalAmount = totalAmount;
        console.log(formattedOrders)
        return res.status(200).json({ orders: formattedOrders });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
//  const update

const updateOrderStatus = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        const updatedOrder = await orderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}


// admin controllers
// admin can update add delete and approve any product of seller any seller also manage users and orders
const getAllSellers = async (req, res) => {
    try {
        const sellers = await userModel.find({ role: "seller" });
        return res.status(200).json({ sellers });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
const getAllProductsOfASeller = async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const products = await productModel.find({ seller: sellerId });
        return res.status(200).json({ products });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
const updateProductAsAdmin = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const deleteProductAsAdmin = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        await productModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const approveProductAsAdmin = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        return res.status(200).json({ message: "Product approved successfully", product: updatedProduct });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const rejectProductAsAdmin = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, { approved: false }, { new: true });
        return res.status(200).json({ message: "Product rejected successfully", product: updatedProduct });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// const get


module.exports = {
    placeOrder,
    cancelOrder,
    commentProduct,
    likeProduct,
    getAllOrders,
    getAllOrdersForEachSellerProducts
}