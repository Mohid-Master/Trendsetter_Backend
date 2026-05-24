const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({    
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6

    },
    role:{
        type:String,
        default: 'user',
        enum: ['user', 'seller', 'admin'],
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return;
        // return next();
    }
    try {       
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return;
    } catch (error) {
        return error;
    }
});


const userModel = mongoose.model('User', userSchema);

module.exports = userModel;