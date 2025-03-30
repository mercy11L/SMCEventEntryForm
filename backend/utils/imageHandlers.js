const fs = require("fs");
const path = require("path");
const { Paragraph, ImageRun, AlignmentType,TextRun } = require("docx");

function displayParticipantList(imagePaths) {
    return imagePaths.map(filePath => {
        return new Paragraph({
            children: [
                new ImageRun({
                    type: "png",
                    data: fs.readFileSync(`./public/images/${filePath}`),
                    transformation: { width: 11906, height: 16838 },
                }),
            ],
            alignment: AlignmentType.CENTER,
        });
    });
}

function displayGeoImagesWithCaptions(geoFilePaths, captions) {
    return geoFilePaths.map((filePath, index) => {
        const caption = captions[index]?.trim() || "No caption provided";
        return new Paragraph({
            children: [
                new ImageRun({
                    type: "png",
                    data: fs.readFileSync(`./public/images/${filePath}`),
                    transformation: { width: 600, height: 300 },
                }),
                new Paragraph({
                    children: [new TextRun({ text: caption })],
                    spacing: { before: 100, after: 200 },
                }),
            ],
            alignment: AlignmentType.CENTER,
        });
    });
}

module.exports = { displayParticipantList, displayGeoImagesWithCaptions };
