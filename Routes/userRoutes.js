const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Users = require('../Models/userModels')
const Profile = require('../Models/profile')
const verifyToken = require('../middleWares/authMiddleware')
const authorizedRole = require('../middleWares/authorizedRole')
const upload = require('../middleWares/imageMiddleware')

router.get('/', verifyToken, authorizedRole("admin", "manager", "user"), (req, res) => {
  res.status(200).json({ message: "Welcome To ProTorAI" })
})

router.get('/profile/:id', verifyToken, authorizedRole("admin", "manager", "user"), async (req, res) => {
  try {
    const profileId = req.params.id;

    const response = await Profile.findById({ profileId });

    if (!response) {
      return res.status(404).json({ message: 'Profile data not fetched' });
    }
    res.json({ message: 'Profile data fetched', response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/profile', async (req, res) => {
  try {
    const profileData = req?.body;
    const newProfile = new Profile(profileData);
    await newProfile.save();
    return res.status(201).json({
      message: 'Profile created successfully',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile/:id', async (req, res) => {
  try {
    const profileData = req?.body;
    const { id } = req.params

    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    await Profile.findByIdAndUpdate(id, profileData, { new: true });

    return res.status(200).json({
      message: 'Profile Updated successfully',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/resetPassword/:token', verifyToken, async (req, res) => {
  const authHeader = req?.params.token;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Login Required or header missing" });
  }

  const token = authHeader.split(" ")[1];
  const { newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = Users.findOne(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = await bcrypt.hash(newPassword, 5);

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
});

module.exports = router