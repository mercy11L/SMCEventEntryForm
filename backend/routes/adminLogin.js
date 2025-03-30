const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();

router.post("/AdminLogin", async (req, res) => {
    const { email, password } = req.body;

    const adminEmail = process.env.AEMAIL;
    const adminPassword = process.env.APWD;

    if (email !== adminEmail || password !== adminPassword) {
        return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ role: "admin" }, process.env.TOKEN_KEY, { expiresIn: "1h" });
    res.json({ token, admin: { email: adminEmail } });
});

module.exports = router;