const express = require("express");
const router = express.Router();
const detModel = require("../models/DetsModel");
const path = require("path");

// Fetch all events
router.get("/events", async (req, res) => {
    try {
        const events = await detModel.find();
        res.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Serve static files from "public/files"


module.exports = router;
