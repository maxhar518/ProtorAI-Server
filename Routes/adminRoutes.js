const express = require('express');
const router = express.Router();
const verifyToken = require('../middleWares/authMiddleware')
const authorizedRole = require('../middleWares/authorizedRole')
const Question = require('../Models/Question');

router.get('/', verifyToken, authorizedRole("admin"), (req, res) => {
    res.status(200).json({ message: "Welcome admin" })
})
router.get('/manager', verifyToken, authorizedRole("admin", "manager"), (req, res) => {
    res.status(200).json({ message: "Welcome manager" })
})

module.exports = router