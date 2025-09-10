const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const users = require('../Models/userModels')
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

router.post('/resetPassword/', verifyToken, async (req, res) => {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization header missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    const { newPassword } = req.body;
    console.log(token, newPassword);
    console.log(process.env.JWT_SECRET);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = users.findOne(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = await bcrypt.hash(newPassword, 5);

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json(error)

    }

});

module.exports = router