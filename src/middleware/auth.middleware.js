const jwt = require("jsonwebtoken");

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Decode token once and attach it to the request object
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    
    next(); // Pass control to the next function
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
  }
};

// Middleware to restrict access to sellers/admins only
const isSeller = (req, res, next) => {
  // Enforce role restriction (assumes req.user is set by isAuthenticated)
  if (!req.user || req.user.role === "user") {
    return res.status(403).json({ message: "Forbidden: Seller account required" });
  }
  next();
};

module.exports = { isAuthenticated, isSeller };