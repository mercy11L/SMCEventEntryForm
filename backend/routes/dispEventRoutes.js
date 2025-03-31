const express = require("express");
const detModel = require("../models/DetsModel");
const router = express.Router();

router.get("/events", async (req, res) => {
    try {
        const events = await detModel.find();
        res.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;