const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/UserModel");
require("dotenv").config();

router.post('/Login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }
    try {
        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User details not found." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password." });
        }
        
        const token = jwt.sign({ id: user._id, email }, process.env.TOKEN_KEY, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful.",token: token});
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error." });
    }
});

// const createSecretToken = (id) => {
//     return jwt.sign({ id }, process.env.TOKEN_KEY, {
//       expiresIn: 1 * 24 * 60 * 60,
//     });
// };

module.exports = router;