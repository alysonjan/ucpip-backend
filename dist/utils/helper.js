"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawWrappedText = exports.splitTextIntoLines = void 0;
const pdf_lib_1 = require("pdf-lib");
// Helper function to split the text into lines based on the max width
const splitTextIntoLines = (text, maxWidth, fontSize, font) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const textWidth = font.widthOfTextAtSize(testLine, fontSize);
        // If the line exceeds the max width, push the current line and start a new one
        if (textWidth > maxWidth) {
            lines.push(currentLine);
            currentLine = word; // Start a new line with the current word
        }
        else {
            currentLine = testLine; // Continue adding to the current line
        }
    });
    // Push the remaining line
    if (currentLine) {
        lines.push(currentLine);
    }
    return lines;
};
exports.splitTextIntoLines = splitTextIntoLines;
// Function to draw text with word wrap
const drawWrappedText = (page, font, text, x, startY, maxWidth, fontSize) => {
    // Use the helper function to split the text into lines
    const lines = (0, exports.splitTextIntoLines)(text, maxWidth, fontSize, font);
    // Draw each line, adjusting the Y position for each line
    lines.forEach((line, index) => {
        page.drawText(line, {
            x, // Use the dynamic horizontal position
            y: startY - (index * fontSize), // Adjust vertical position for each line
            size: fontSize,
            font,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
        });
    });
};
exports.drawWrappedText = drawWrappedText;
