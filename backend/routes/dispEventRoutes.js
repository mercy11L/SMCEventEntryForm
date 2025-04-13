const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const db = require("../db");

router.get("/events", async (req, res) => {
    try {
        const [events] = await db.query("SELECT * FROM event_details");
        res.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/events/:id", async (req, res) => {
    console.log("Delete request received for ID:", req.params.id);

    try {
        const [rows] = await db.query("SELECT * FROM event_details WHERE Eid = ?", [req.params.id]);
        console.log("Fetched rows:", rows.length);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        const event = rows[0];

        // Delete array files
        const deleteFile = (filePath) => {
            const fullPath = path.join(__dirname, "../public/", filePath);
            console.log("Deleting file:", fullPath);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        };

        const deleteImageFiles = (filePaths) => {
            if (!filePaths) return;
            try {
                const arr = JSON.parse(filePaths);
                arr.forEach(file => {
                    if (file) deleteFile(`images/${file}`);
                });
            } catch (e) {
                console.log("Failed to parse file paths:", filePaths);
            }
        };

        deleteImageFiles(event.GeoFilePaths);
        deleteImageFiles(event.inviteFilePaths);
        deleteImageFiles(event.ptlistFilePaths);
        deleteImageFiles(event.fbackFilePaths);

        if (event.signatureFilePath) deleteFile(`images/${event.signatureFilePath}`);
        if (event.certFilePath) deleteFile(`images/${event.certFilePath}`);

        deleteFile(`pdfFiles/Event_Report_${event.Eid}.pdf`);
        deleteFile(`wordFiles/Event_Report_${event.Eid}.docx`);

        await db.query("DELETE FROM event_details WHERE Eid = ?", [req.params.id]);
        console.log("Event deleted from DB");

        return res.json({ message: "Event and associated files deleted successfully" });

    } catch (error) {
        console.error("Error deleting event:", error);
        return res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;