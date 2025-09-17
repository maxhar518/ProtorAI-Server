const express = require("express");
const router = express.Router();
const fs = require("fs");
const upload = require('../middleWares/imageMiddleware');
const { RekognitionClient, DetectLabelsCommand } = require("@aws-sdk/client-rekognition");
const client = new RekognitionClient({ region: process.env.AWS_REGION });


router.post("/image", upload.single("image"), async (req, res) => {
    try {
        
        if (!req.file) {
            console.log("No image uploaded");
            return res.status(400).json({ message: "Image is required" });
        }
        
        const imageBytes = fs.readFileSync(req.file.path);
        const params = {
            Image: { Bytes: imageBytes },
            MaxLabels: 10,
            MinConfidence: 70
        };

        const command = new DetectLabelsCommand(params);
        const response = await client.send(command);

        console.log("Detection result:", response.Labels);
        res.status(200).json(response.Labels)

    } catch (err) {
        console.error("Image detection error:", err);
        res.status(500).json({ message: "Image detection failed", error: err.message });
    }
});

module.exports = router;
