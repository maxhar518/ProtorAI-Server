const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const users = require('../Models/userModels')
const JWT_SECRET = "mazhar518"

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !password)
            return res.status(400).json({ message: 'Username and password required' });

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 5);

        const user = new users({
            username: username,
            email,
            password: hashedPassword,
            role: users.roles
        })
        await user.save()

        res.status(201).json({ sucess: true, message: 'User registered successfully', user });

    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
});

router.post('/login', async (req, res) => {
    try {

        const { username, password } = req.body;
        const user = await users.findOne({ username: username });

        if (!(user.username == username))
            return res.status(404).json({ message: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password);

        if (!valid)
            return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.roles }, JWT_SECRET)
        res.status(200).json({ token: token, sucess: true, message: "Login Success" })
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
});

module.exports = router;