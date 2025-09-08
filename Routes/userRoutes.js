const express = require('express');
const router = express.Router();
const verifyToken = require('../middleWares/authMiddleware')
const authorizedRole = require('../middleWares/authorizedRole')
router.get('/admin', verifyToken, authorizedRole("admin"), (req, res) => {
    res.status(200).json({ message: "Welcome admin" })
})
router.get('/manager', verifyToken, authorizedRole("admin", "manager"), (req, res) => {
    res.status(200).json({ message: "Welcome manager" })
})
router.get('/user', verifyToken, authorizedRole("admin", "manager", "user"), (req, res) => {
    res.status(200).json({ message: "Welcome user" })
})
module.exports = router