const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const registerUser = async (req, res) => {    
    try {
        const { email, password, role='user' } = req.body;
        console.log(req.body);
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }   
        // Create new user
        const newUser = await userModel.create({ email, password, role });
        // await newUser.save();
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET);
        res.cookie("token",token);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }   
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.cookie("token", token);

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

async function loginAdmin(req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user || user.role !== 'admin') {
            return res.status(400).json({ message: 'Invalid credentials' });
        }       
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
        res.cookie("token", token);
        res.status(200).json({ message: 'Admin login successful', user });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }       
}
async function logoutUser(req, res) {
    try {
        if (!req.cookies.token) {
            return res.status(400).json({ message: 'You are not logged in' });
        }
        res.clearCookie("token");   
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }   
}



module.exports = {
    registerUser,
    loginUser,
    loginAdmin,
    logoutUser
}