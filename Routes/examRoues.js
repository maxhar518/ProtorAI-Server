const express = require('express');
const mongoose = require('mongoose');
const questions = require('../Models/Question');
const CheatingLog = require('../Models/CheatingLog');

const router = express.Router();

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

router.post('saveCheatingLog', async (req, res) => {
    try {
        const {
            noFaceCount,
            multipleFaceCount,
            cellPhoneCount,
            prohibitedObjectCount,
            examId,
            username,
            email,
            screenshots,
        } = req.body;

        const cheatingLog = new CheatingLog({
            noFaceCount,
            multipleFaceCount,
            cellPhoneCount,
            prohibitedObjectCount,
            examId,
            username,
            email,
            screenshots,
        });

        const savedLog = await cheatingLog.save();
        console.log("Saved cheating log:", savedLog);

        if (savedLog) {
            res.status(201).json(savedLog);
        } else {
            res.status(400);
            throw new Error("Invalid Cheating Log Data");
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/getCheatingLogsByExamId/:examId', async (req, res) => {
    const examId = req.params.examId;
    try {
        const cheatingLogs = await CheatingLog.find({ examId });
        res.status(200).json(cheatingLogs);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;