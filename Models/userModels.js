const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        enum: ['admin', 'user', 'manager'],
    }
});

module.exports = mongoose.model('User', userSchema);