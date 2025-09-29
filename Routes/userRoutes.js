const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Profile = require('../Models/profile')
const verifyToken = require('../middleWares/authMiddleware')
const authorizedRole = require('../middleWares/authorizedRole')
const upload = require('../middleWares/imageMiddleware')

router.get('/', verifyToken, authorizedRole("admin", "manager", "user"), (req, res) => {
  res.status(200).json({ message: "Welcome To ProTorAI" })
})

router.get('/profile', verifyToken, authorizedRole("admin", "manager", "user"), async (req, res) => {
  try {
    const { id } = req?.user;
    const response = await Profile.findOne({ _id: id });
    if (!response) {
      return res.status(404).json({ message: 'User Profile data not Found' });
    }

    res.json({ success: true, message: 'User Profile data Found', response });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});


router.post('/profile', verifyToken, authorizedRole("admin", "manager", "user"), async (req, res) => {
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

module.exports = router