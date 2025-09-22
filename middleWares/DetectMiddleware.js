const fs = require("fs");
const Webcam = require("node-webcam");
const { RekognitionClient, DetectLabelsCommand } = require("@aws-sdk/client-rekognition");
const client = new RekognitionClient({ region: process.env.AWS_REGION });

const webcam = Webcam.create({
    width: 640,
    height: 480,
    quality: 80,
    output: "jpeg",
    device: false,
    callbackReturn: "location",
    verbose: false
});

const captureAndAnalyze = webcam.capture("frame", async (err, data, req, next) => {
    if (err) { return next(err) }

    const imageBytes = fs.readFileSync(data);

    const command = new DetectLabelsCommand({
        Image: { Bytes: imageBytes },
        MaxLabels: 5,
        MinConfidence: 70,
    });

    try {
        const response = await client.send(command);
        const labels = response.Labels.map(l => `${l.Name} (${l.Confidence.toFixed(2)}%)`);

        req.detectedLabels = labels;

        console.log("Detected labels:", labels);
        next();
    } catch (e) {
        console.error("Rekognition error:", e);
        return next(e);
    }
});

module.exports = captureAndAnalyze