const { Table, TableRow, TableCell, Paragraph, TextRun, WidthType, AlignmentType } = require("docx");

function createEventDetailsTable(eventDetails) {
    const tableRows = eventDetails.map(detail => 
        new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: detail.label })] })],
                    width: { size: 35, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: ":" })] })],
                    width: { size: 3, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: detail.value, bold: true })] })],
                    width: { size: 62, type: WidthType.PERCENTAGE },
                }),
            ]
        })
    );

    return new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE }, alignment: AlignmentType.LEFT });
}

module.exports = { createEventDetailsTable };
