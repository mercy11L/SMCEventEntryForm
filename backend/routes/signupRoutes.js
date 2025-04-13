const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = require("../db");

router.post('/SignUp', async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Request body:", req.body);

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if the user already exists
        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash password and insert user
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

        const token = jwt.sign({ id: result.insertId, email }, process.env.TOKEN_KEY, { expiresIn: "1h" });

        res.status(200).json({ message: "User registered successfully.", token });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;
