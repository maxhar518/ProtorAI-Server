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

setInterval(
    async function captureAndAnalyze() {
        webcam.capture("frame", async (err, data) => {
            if (err) {
                console.error("Webcam error:", err);
                return;
            }
            const imageBytes = fs.readFileSync(data);

            const command = new DetectLabelsCommand({
                Image: { Bytes: imageBytes },
                MaxLabels: 5,
                MinConfidence: 70
            });

            console.log("webcam started");
            try {
                const response = await client.send(command);
                console.log("Detected labels:", response.Labels.map(l => `${l.Name} (${l.Confidence.toFixed(2)}%)`));
            } catch (e) {
                console.error("Rekognition error:", e);
            }
        });
    }, 5000)