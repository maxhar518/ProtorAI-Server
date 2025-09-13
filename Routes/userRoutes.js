const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const users = require('../Models/userModels')
const verifyToken = require('../middleWares/authMiddleware')
const authorizedRole = require('../middleWares/authorizedRole')
const upload = require('../middleWares/imageMiddleware')

router.get('/user', verifyToken, authorizedRole("admin", "manager", "user"), (req, res) => {
    res.status(200).json({ message: "Welcome user" })
})


router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Example: save file path in DB with user profile
    // await User.findByIdAndUpdate(req.user.id, { profileImage: req.file.path });

    res.json({ message: 'Image uploaded', file: req.file });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/resetPassword', verifyToken, async (req, res) => {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Login Required or header missing" });
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