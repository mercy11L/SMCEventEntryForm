const express = require("express");
const router = express.Router();
const db = require("../db");  

router.get("/events/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [events] = await db.query("SELECT * FROM event_details WHERE user_id = ?", [userId]);
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});

module.exports = router;
