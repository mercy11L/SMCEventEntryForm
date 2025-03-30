const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/UserModel");
require("dotenv").config();

//in downloads
router.post('/SignUp', async (req, res) => {
    const {name,email,password} = req.body;
    console.log(req.body);
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email }, process.env.TOKEN_KEY, { expiresIn: "1h" });
        
        res.status(200).json({ message: "User registered successfully.",token: token});
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});

// const createSecretToken = (id) => {
//     return jwt.sign({ id }, process.env.TOKEN_KEY, {
//       expiresIn: 1 * 24 * 60 * 60,
//     });
// };

module.exports = router;