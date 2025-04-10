const express = require("express");
const detModel = require("../models/DetsModel");
const fs = require("fs");
const path = require("path");
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

router.delete("/events/:id", async (req, res) => {
    try {
        const event = await detModel.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // function to safely delete a file
        const deleteFile = (filePath) => {
            const fullPath = path.join(__dirname, "../public/", filePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            } else {
                console.log(`File not found: ${fullPath}`);
            }
        };

        // delete all stored image files
        const deleteImageFiles = (filePathsArray) => {
            filePathsArray.forEach(filePath => {
                if (filePath) {
                    deleteFile(`images/${filePath}`);
                }
            });
        };

        // delete images stored in arrays
        deleteImageFiles(event.GeoFilePaths);
        deleteImageFiles(event.inviteFilePaths);
        deleteImageFiles(event.ptlistFilePaths);
        deleteImageFiles(event.fbackFilePaths);

        // delete signature and certificate images
        if (event.signatureFilePath) deleteFile(`images/${event.signatureFilePath}`);
        if (event.certFilePath) deleteFile(`images/${event.certFilePath}`);

        // delete event report files
        deleteFile(`pdfFiles/Event_Report_${event._id}.pdf`);
        deleteFile(`wordFiles/Event_Report_${event._id}.docx`);

        // delete event from database
        await detModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Event and associated files deleted successfully" });

    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;