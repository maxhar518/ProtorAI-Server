const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const questions = require('../Models/Question');


router.get('/', async (req, res) => {
    try {
        const data = await questions.find()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid exam ID' });
    }
    try {
        const exam = await questions.findById(id);
        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }
        res.status(200).json(exam);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid exam ID' });
    }
    try {
        const exam = await questions.findByIdAndDelete(id);
        res.status(200).json({message:"Question Deleted"});
    } catch (err) {
        res.status(500).json(err);
    }
});

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

module.exports = router;