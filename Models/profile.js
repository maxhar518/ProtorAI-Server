const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    studentId: {
        type: String,
        unique: true,
        match: /^[A-Za-z0-9-]+$/,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    secondName: {
        type: String,
        trim: true
    },
    profilePicture: {
        type: String,
        default: './uploads/profile_pics/default.jpg'
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    phoneNumber: {
        type: String,
        default: null
    },
    updatedAt: {
        type: Date,
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
