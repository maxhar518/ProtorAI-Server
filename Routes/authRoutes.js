const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')
const users = require('../Models/userModels')

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) return res.status(400).json({ message: "Missing fields" });

        if (!/^\w+$/.test(username)) return res.status(400).json({ message: "Invalid username" });
        if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) return res.status(400).json({ message: "Invalid email" });

        const existingUser = await users.findOne({ email });
        if (existingUser) return res.status(409).json({ message: 'Username or Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 5);

        const user = new users({
            username: username,
            email,
            password: hashedPassword,
            role: role
        })

        await user.save()

        res.status(201).json({ success: true, message: 'User registered successfully', user });

    } catch (error) { res.status(500).json(error) }
});

router.post('/login', async (req, res) => {
    try {

        const { email, password } = req?.body;
        const user = await users.findOne({ email: email });

        if (user.email) {
            const valid = await bcrypt.compare(password, user.password);

            if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET)
            res.status(200).json({ token: token, message: "Login Success", success: true })
        } else { return res.status(404).json({ message: 'Invalid credentials' }); }
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
});

router.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;

    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    });

    const resetLink = `http://localhost:3000/users/resetPassword/${token}`;

    const mailOptions = {
        from: `${process.env.EMAIL}`,
        to: user.email,
        subject: "Password Reset Link",
        text: `Click here to reset your password: ${resetLink}`,
    };


    try {
        await sendEmail(mailOptions);
        res.status(200).json({ success: true, message: 'Password reset link sent to email' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err, message: 'Error sending email' });
    }
});

module.exports = router;