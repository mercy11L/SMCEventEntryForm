const { AlignmentType } = require("docx");

const numbering = {
    config: [
        {
            reference: "ol-numbering",
            levels: [
                {
                    level: 0,
                    format: "decimal",
                    text: "%1.",
                    style: {
                        paragraph: {
                            indent: {left:360, hanging: 360},
                            alignment: AlignmentType.JUSTIFIED,
                        },
                    },
                },
            ],
        },
        {
            reference: "ul-numbering",
            levels: [
                {
                    level: 0,
                    format: "bullet",
                    text: "•",
                    style: {
                        paragraph: {
                            indent: {left:360, hanging: 360 },
                            alignment: AlignmentType.JUSTIFIED,
                        },
                    },
                },
            ],
        },
    ],
};

module.exports = numbering;
