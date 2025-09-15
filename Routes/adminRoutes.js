const express = require('express');
const router = express.Router();
const verifyToken = require('../middleWares/authMiddleware')
const authorizedRole = require('../middleWares/authorizedRole')
const Question = require('../Models/Question');

router.get('/', verifyToken, authorizedRole("admin"), (req, res) => {
    res.status(200).json({ message: "Welcome admin" })
})
router.post('/questions', verifyToken, authorizedRole("admin", "manager"), async (req, res) => {
    try {
        const { question, options, answer, marks } = req.body;
        const newQuestion = new Question({ question, options, answer, marks });
        await newQuestion.save();
        res.status(201).json({ message: "Question saved successfully", question: newQuestion });
    } catch (error) {
        res.status(500).json({ message: "Error saving question", error: error.message });
    }
});
router.get('/manager', verifyToken, authorizedRole("admin", "manager"), (req, res) => {
    res.status(200).json({ message: "Welcome manager" })
})

module.exports = router