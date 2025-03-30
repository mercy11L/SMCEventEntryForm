const { JSDOM } = require("jsdom");
const { Paragraph, TextRun } = require("docx");

function convertHtmlToDocx(html) {
    const { document } = new JSDOM(`<!DOCTYPE html><body>${html}</body>`).window;
    const body = document.body;
    const paragraphs = [];

    function processNode(node, styles = {}) {
        const runs = [];
        node.childNodes.forEach((child, index) => {
            if (child.nodeType === 3) { 
                const textContent = child.textContent.replace(/\u00a0/g, ' ');
                if (textContent.trim() || textContent.includes(' ')) {
                    runs.push(new TextRun({ text: textContent, ...styles }));
                }
            } else {
                const newStyles = { ...styles };
                if (child.nodeName === 'STRONG') newStyles.bold = true;
                if (child.nodeName === 'U') newStyles.underline = {};
                if (child.nodeName === 'EM') newStyles.italics = true;
                if (child.nodeName === 'S') newStyles.strike = true;

                if (child.nodeName === 'H1') newStyles.size = 32;
                if (child.nodeName === 'H2') newStyles.size = 28;
                if (child.nodeName === 'H3') newStyles.size = 24;

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
                paragraphs.push(new Paragraph({ children }));
            }
        }
    });

    return paragraphs;
}

module.exports = { convertHtmlToDocx };
