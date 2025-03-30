const { AlignmentType } = require("docx");

const styles = {
    paragraphStyles: [
        {
            id: "normal",
            name: "normal",
            run: {
                font: "Times New Roman",
                size: 24,
            },
            paragraph: {
                spacing: {
                    line: 360, // 1.5 line spacing (240 = single, 360 = 1.5, 480 = double)
                },
                alignment: AlignmentType.JUSTIFIED,
            },
        },
    ],
};

module.exports = styles;
