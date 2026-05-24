const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({    
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        default: 'user',
        enum: ['user', 'seller', 'admin'],
    }
});

const authModel = mongoose.model('Auth', authSchema);

module.exports = authModel;