const express = require("express");
const router = express.Router();
const detModel = require("../models/DetsModel");

router.get("/events/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const events = await detModel.find({ user: userId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
});

module.exports = router;
