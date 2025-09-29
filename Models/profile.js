const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    name: {
        type: String,
        require: false
    },
    email: {
        type: String,
        require: false,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        require: false
    },
    role: {
        type: String,
        require: false,
        enum: ['admin', 'user', 'manager'],
        default: "user"
    },
    profilePicture: {
        type: String,
        require: false,
        default: './uploads/profile_pics/default.jpg'
    },
    qualification: {
        type: String,
        require: false
    },
    dateOfBirth: {
        type: Date,
        require: false
    },
    phoneNumber: {
        type: String,
        require: false,
        default: null
    },
    updatedAt: {
        type: Date,
        require: false,
        default: Date.now
    }
});

// Optional: Middleware to update 'updatedAt' field automatically
ProfileSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
