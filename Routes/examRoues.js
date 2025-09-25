const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Questions = require('../Models/Question');
// const captureAndAnalyze = require('../middleWares/DetectMiddleware')
const verifyToken = require('../middleWares/authMiddleware')
const authorizedRole = require('../middleWares/authorizedRole')


router.get('/', verifyToken, authorizedRole("admin", "manager", "user"), async (req, res) => {
    try {
        const data = await Questions.find()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/:id', verifyToken, authorizedRole("admin", "manager", "user"), async (req, res) => {
    const { id } = req.params;
    try {
        const exam = await Questions.findById(id);
        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }
        res.status(200).json({ exam, success: true });
    } catch (err) {
        res.status(500).json(err);
    }
});


router.delete('/:id', verifyToken, authorizedRole("admin", "manager"), async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid exam ID' });
    }
    try {
        const exam = await Questions.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Question Deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/questions', verifyToken, authorizedRole("admin", "manager"), async (req, res) => {
    try {
        const { question, options, answer, marks } = req.body;
        const newQuestion = new Questions({ question, options, answer, marks });
        await newQuestion.save();
        res.status(201).json({ success: true, message: "Question saved successfully", question: newQuestion });
    } catch (error) {
        res.status(500).json({ message: "Error saving question", error: error.message });
    }
});

router.put('/:id', verifyToken, authorizedRole("admin", "manager"), async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid exam ID' });
    }
    try {
        const updatedQuestion = await Questions.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedQuestion) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.status(200).json({ success: true, message: "Question updated successfully", Question: updatedQuestion });
    } catch (error) {
        res.status(500).json({ message: "Error updating question", error: error.message });
    }
});

module.exports = router;