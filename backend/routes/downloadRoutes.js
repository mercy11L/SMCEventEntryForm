const express = require('express');
const router = express.Router();
const path=require("path");
const detModel = require("../models/DetsModel");
const fs = require("fs");
const mime = require('mime-types');
const { JSDOM } = require("jsdom");
const numbering = require("../utils/numbering");
const styles = require("../utils/styles");
const { formatDate } = require("../utils/dateHelpers");
const {Document,Paragraph,ImageRun,PageBreak,AlignmentType,WidthType,TextRun,Packer,Table,Header,Footer, TableCell, TableRow} = require("docx");

router.get("/download/:id", async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await detModel.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        
        function convertHtmlToDocx(html) {
            const { document } = new JSDOM(`<!DOCTYPE html><body>${html}</body>`).window;
            const body = document.body;
            const paragraphs = [];
        
            function processNode(node, styles = {}) {
                const runs = [];
        
                node.childNodes.forEach((child, index) => {
                    if (child.nodeType === 3) { // Text node
                        const textContent = child.textContent.replace(/\u00a0/g, ' '); 
                        if (textContent.trim() || textContent.includes(' ')) {
                            runs.push(new TextRun({ text: textContent, ...styles }));
                        }
                    } else {
                        const newStyles = { ...styles };
        
                        // Apply styles based on tag
                        if (child.nodeName === 'STRONG') newStyles.bold = true;
                        if (child.nodeName === 'U') newStyles.underline = {};
                        if (child.nodeName === 'EM') newStyles.italics = true;
                        if (child.nodeName === 'S') newStyles.strike = true;
        
                        // Handle heading tags with different sizes
                        if (child.nodeName === 'H1') newStyles.size = 32;
                        if (child.nodeName === 'H2') newStyles.size = 28;
                        if (child.nodeName === 'H3') newStyles.size = 24;
        
                        // Process child elements recursively
                        const childRuns = processNode(child, newStyles);
                        if (index > 0 && runs.length > 0) {
                            const lastRun = runs[runs.length - 1];
                            const lastText = lastRun.root?.options?.text || '';
                            if (lastText && !lastText.endsWith(' ')) {
                                runs.push(new TextRun({ text: ' ' }));
                            }
                        }
                        runs.push(...childRuns);
                    }
                });
        
                return runs;
            }
            body.childNodes.forEach(node => {
                if (['P', 'H1', 'H2', 'H3'].includes(node.nodeName)) {
                    const children = processNode(node);
                    if (children.length > 0) {
                        paragraphs.push(new Paragraph({
                            children,
                            heading: node.nodeName === 'H1' ? 'Heading1' :
                                     node.nodeName === 'H2' ? 'Heading2' :
                                     node.nodeName === 'H3' ? 'Heading3' : undefined,
                            //indent: { left: 1440, right: 1440 }
                        }));
                    }
                } 
                else if (node.nodeName === 'UL') {
                    node.childNodes.forEach(li => {
                        if (li.nodeName === 'LI') {
                            const children = processNode(li);
                            if (children.length > 0) {
                                paragraphs.push(new Paragraph({
                                    children,
                                    numbering: { reference: 'ul-numbering', level: 0 },
                                    style: "normal",
                                    //indent: { left: 2000, right: 1440 }, run: { size: 18, },
                                }));
                            }
                        }
                    });
                }
                else if (node.nodeName === 'OL') {
                    let listIndex = 0;
                    node.childNodes.forEach(li => {
                        if (li.nodeName === 'LI') {
                            listIndex++;
                            const children = processNode(li);
                            if (children.length > 0) {
                                paragraphs.push(new Paragraph({
                                    children,
                                    numbering: {
                                        reference: 'ol-numbering',
                                        level: 0
                                    },
                                    style:"normal",
                                }));
                            }
                        }
                    });
                }
               
            });
                       
            return paragraphs;
        }
        
        const bannerImage = fs.readFileSync(path.join(__dirname, "../public/code_image/banner.png"));
        const logoImage = fs.readFileSync(path.join(__dirname, "../public/code_image/slogo.png"));
        const footerImage = fs.readFileSync(path.join(__dirname, "../public/code_image/footer.png"));
        const wmark= fs.readFileSync(path.join(__dirname, "../public/code_image/stella_watermark.png"));
        const sign= fs.readFileSync(path.join(__dirname, "../public/images/", event.signatureFilePath));
        const objParagraphs = convertHtmlToDocx(event.obj);
        const descParagraphs = convertHtmlToDocx(event.desc);
        const outcomeParagraphs = convertHtmlToDocx(event.outcome);
        
        const eventDetails = [
            { label: "Academic Year", value: "2023 – 2024" },
            { label: "Name of the Event", value: event.name },
            { label: "Organised By", value: event.selectedOptions.join("\n") },
            { label: "Date", value: formatDate(event.eventDate) },
            { label: "Number of Participants", value: String(event.nofpart) },
            { label: "Theme", value: event.theme },
        ];        

        const tableRows1 = eventDetails.map(detail => 
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: `${detail.label}` })] })],
                        margins: { top: 110, bottom: 110 },
                        width: { size: 35, type: WidthType.PERCENTAGE },
                        verticalAlign: "center",
                    }),
                    new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: ":" })] })],
                        margins: { top: 110, bottom: 110 },
                        width: { size: 3, type: WidthType.PERCENTAGE },
                        verticalAlign: "center",
                    }),
                    new TableCell({
                        children: detail.value.split("\n").map(text => 
                            new Paragraph({
                                children: [new TextRun({ text, bold: true })]
                            })
                        ),
                        margins: { top: 110, bottom: 110 },
                        width: { size: 62, type: WidthType.PERCENTAGE },
                        verticalAlign: "center",
                    }),
                ]
            })
        );
        const eventTable = new Table({
            rows: tableRows1,
            width: { size: 100, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.LEFT,
            borders: {
                top: { style: "none" },
                bottom: { style: "none" },
                left: { style: "none" },
                right: { style: "none" },
                insideHorizontal: { style: "none" },
                insideVertical: { style: "none" },
            },
        });

        const inviteImageRows = [];

        if (event.inviteFilePaths && event.inviteFilePaths.length > 0) {
            for (let i = 0; i < event.inviteFilePaths.length; i += 2) {
                const image1Path = path.join(__dirname, "../public/images/", event.inviteFilePaths[i]);
                const image1 = fs.existsSync(image1Path) ? fs.readFileSync(image1Path) : null;
                const image2Path = event.inviteFilePaths[i + 1] 
                    ? path.join(__dirname, "../public/images/", event.inviteFilePaths[i + 1])
                    : null;
                const image2 = image2Path && fs.existsSync(image2Path) ? fs.readFileSync(image2Path) : null; 

                const cells = [
                    new TableCell({
                        children: image1
                            ? [new Paragraph({
                                children: [
                                    new ImageRun({
                                        type: "png",
                                        data: image1,
                                        transformation: { width: 300, height: 470 },
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                            })]
                            : [new Paragraph({ text: "" })],
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            margins: { top: 150, bottom: 150, left: 150, right: 150 },
                    }),
                    new TableCell({
                        children: image2
                            ? [new Paragraph({
                                children: [
                                    new ImageRun({
                                        type: "png",
                                        data: image2,
                                        transformation: { width: 300, height: 470 },
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                            })]
                            : [new Paragraph({ text: "" })], // Leave empty if no second image
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            margins: { top: 150, bottom: 150, left: 150, right: 150 },
                    }),
                ];
                inviteImageRows.push(new TableRow({ children: cells }));
            }
        }

        const inviteImageTable = new Table({
            rows: inviteImageRows.length > 0 ? inviteImageRows : null,
            width: { size: 110, type: WidthType.PERCENTAGE },
            alignment: AlignmentType.CENTER,
            borders: {
                top: { style: "none" },
                bottom: { style: "none" },
                left: { style: "none" },
                right: { style: "none" },
                insideHorizontal: { style: "none" },
                insideVertical: { style: "none" },
            },
        });

        const geocap= event.geocap;
        const geoImagesWithCaptions = event.GeoFilePaths.map((filePath, index) => {
            const captionsArray = geocap ? geocap.split(',') : [];
            const caption = captionsArray[index]?.trim() || "";
        
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

        const ptlistDisplay = event.ptlistFilePaths.map(filePath => {
            return new Paragraph({
                children: [
                    new ImageRun({
                        type: "png",
                        data: fs.readFileSync(`./public/images/${filePath}`),
                        transformation: { 
                            width: 600,
                            height: 820,
                        },
                    }),
                ],
                alignment: AlignmentType.CENTER,
            });
        });        

        const doc = new Document({
            numbering,
            styles,
            sections: [
                {   
                    properties: {
                        page: {
                            margin: { top: 0,
                                left: 1440,
                                right: 1440,
                                bottom: 0,
                                 header:0 ,footer:0
                            },
                            //720 = 0.5 inch , 1440 = 1 inch
                        },
                    },
                    headers: {
                        default: new Header({
                            children: [
                                new Paragraph({
                                    children: [
                                        new ImageRun({
                                            type:"png",
                                            data: bannerImage,
                                            transformation: { width: 1000, height: 20 },
                                        }),
                                    ],
                                    alignment: AlignmentType.CENTER,
                                    indent: {left:-1440}
                                }),
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        new ImageRun({
                                            type:"png",
                                            data: logoImage,
                                            transformation: { width: 360, height: 75 },
                                        }),
                                    ],
                                }),
                                new Paragraph({
                                    children: [
                                        new ImageRun({
                                            type:"png",
                                            data: wmark,  //watermark image
                                            transformation: { width: 460, height: 380 },
                                            floating: {
                                                horizontalPosition: { align: "center" },
                                                verticalPosition: { align: "center" },
                                                wrapText: "none",
                                                behindDocument: true,
                                            },
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    },
                    footers: {
                        default: new Footer({
                            children: [
                                new Paragraph({
                                    children: [
                                        new ImageRun({
                                            type:"png",
                                            data: footerImage,
                                            transformation: { width: 800, height: 70 },
                                        }),
                                    ],
                                    indent: {left:-1440},
                                    alignment: AlignmentType.CENTER,
                                    spacing: {             //whole page line spacing = 360(1.5) so footer space adjust
                                        line: 260,
                                        before: 0,
                                        after: 0,
                                    },
                                }),
                            ],
                        }),
                    },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: "EVENT REPORT",
                                    bold: true,
                                }),
                            ],
                        }),
                        eventTable,
                        // new Paragraph({
                        //     children: [],
                        //     pageBreakBefore: true, // Moves next content to a new page
                        // }), // Page break
                        new Paragraph({ text: "" }),
                        inviteImageTable,
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: "Invite of the Event"
                                }),
                                new PageBreak()
                            ],
                        }),
                        new Paragraph({ 
                            children: [new TextRun({ text: "OBJECTIVES OF THE EVENT", bold: true })],
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                before: 200,
                                after: 200,
                            },
                        }),
                        ...objParagraphs,
                        new Paragraph({ 
                            children: [new TextRun({ text: "EVENT DESCRIPTION", bold: true })],
                            alignment: AlignmentType.CENTER ,
                            spacing: {
                                before: 200,
                                after: 200,
                            },
                        }),
                        ...descParagraphs,
                        new Paragraph({ 
                            children: [new TextRun({ text: "OUTCOME OF THE EVENT", bold: true })],
                            alignment: AlignmentType.CENTER ,
                            spacing: {
                                before: 200,
                                after: 200,
                            },
                        }),
                        ...outcomeParagraphs,
                        new Paragraph({ 
                            children: [
                                new PageBreak(),
                                new TextRun({ text: "GEO-TAGGED PICTURES", bold: true })
                            ],
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 200, after: 200 },
                        }),
                        ...geoImagesWithCaptions,
                        new Paragraph({ 
                            children: [
                                new PageBreak(),
                                new TextRun({ text: "PARTICIPANT LIST", bold: true })
                            ],
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 200, after: 200 },
                        }),
                        ...ptlistDisplay,
                        new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                                new ImageRun({
                                    type:"png",
                                    data: sign,
                                    transformation: { width: 150, height: 70 },
                                }),
                            ],
                        }),
                    ], 
                },
            ],
        });

        // Generate the document buffer
        const buffer = await Packer.toBuffer(doc);
        const fileName = `Event_Report_${eventId}.docx`;
        const filePath = path.join(__dirname, "../public/files", fileName);
        fs.writeFileSync(filePath, buffer);

            res.set({
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": "attachment; filename=Event_Report.docx",
                "Content-Length": buffer.length,
            })
            res.send(Buffer.from(buffer));
    }catch (error) {
        console.error("Error generating document:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports=router;