// import mongoose from "mongoose";
const mongoose = require("mongoose")

const cheatingLogSchema = new mongoose.Schema(
    {
        noFaceCount: { type: Number, default: 0 },
        multipleFaceCount: { type: Number, default: 0 },
        cellPhoneCount: { type: Number, default: 0 },
        prohibitedObjectCount: { type: Number, default: 0 },

        examId: { type: String, required: true },
        email: { type: String, required: true },
        username: { type: String, required: true },

        screenshots: [
            {
                url: { type: String, required: true },
                type: {
                    type: String,
                    enum: ["noFace", "multipleFace", "cellPhone", "prohibitedObject"],
                    required: true,
                },
                detectedAt: { type: Date, default: Date.now },
            },
        ],
    }
);

const CheatingLog = mongoose.model("CheatingLog", cheatingLogSchema);

module.exports = CheatingLog
