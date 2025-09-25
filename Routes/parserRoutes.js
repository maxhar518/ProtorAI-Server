const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const router = express.Router();
const upload = multer({ dest: "uploads/" });
const Question = require('../Models/Question')
const verifyToken = require('../middleWares/authMiddleware')
const authorizedRole = require('../middleWares/authorizedRole')

const parseQuestions = (rawText) => {
    const questionBlocks = rawText.split(/(?=Q\d+)/g);
    const results = [];

    questionBlocks.forEach((block) => {
        const qMatch = block.match(/Q\d+[:.]?\s*([\s\S]+?)(?=\n[A-D]\))/i);
        if (!qMatch) return;

        const question = qMatch[1].replace(/\s+/g, " ").trim();

        const marksMatch = block.match(/\(\s*(\d+)\s*marks?\)/i);
        const marks = marksMatch ? parseInt(marksMatch[1]) : null;

        const options = [];
        const optionRegex = /[A-D]\)\s*(.+)/g;
        let optMatch;
        while ((optMatch = optionRegex.exec(block)) !== null) {
            options.push(optMatch[1].trim());
        }

        const answerMatch = block.match(/Answer\s*[:.]?\s*([A-D])/i);
        let answer = null;
        if (answerMatch) {
            const ansIndex = "ABCD".indexOf(answerMatch[1].toUpperCase());
            if (ansIndex >= 0 && options[ansIndex]) {
                answer = options[ansIndex];
            }
        }

        results.push({ question, options, answer, marks });
    });

    return results;
};


router.post("/parseDocument", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const filePath = req.file.path;
        const ext = req.file.originalname.split(".").pop().toLowerCase();

        let rawText = "";

        if (ext === "txt") {
            rawText = fs.readFileSync(filePath, "utf-8");
        } else if (ext === "pdf") {
            const data = await pdfParse(fs.readFileSync(filePath));
            rawText = data.text;
        } else if (ext === "docx") {
            const data = await mammoth.extractRawText({ path: filePath });
            rawText = data.value;
        } else {
            return res.status(400).json({ message: "Unsupported file format" });
        }

        const parsedText = parseQuestions(rawText);
        console.log(parsedText);

        res.status(200).json({ success: true, message: 'Parsed successfully', count: parsedText.length, parsedText });

        // for (const parsed of parsedQuestions) {
        //     const { question, options, answer, marks } = parsed;
        //     const newQuestion = new Question({ question, options, answer, marks });
        //     console.log(newQuestion);
        //     await newQuestion.save();
        // }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
