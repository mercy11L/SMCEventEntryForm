const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = require("../db"); // <- Your promised connection

router.post('/Login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (results.length === 0) {
            return res.status(401).json({ message: "User details not found." });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password." });
        }

        const token = jwt.sign({ id: user.idusers, email: user.email }, process.env.TOKEN_KEY, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful.", token });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;
