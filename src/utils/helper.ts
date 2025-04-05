import { rgb, PDFPage, PDFFont } from 'pdf-lib';


// Helper function to split the text into lines based on the max width
export const splitTextIntoLines = (text: string, maxWidth: number, fontSize: number, font: PDFFont) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
  
    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);
  
      // If the line exceeds the max width, push the current line and start a new one
      if (textWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = word; // Start a new line with the current word
      } else {
        currentLine = testLine; // Continue adding to the current line
      }
    });
  
    // Push the remaining line
    if (currentLine) {
      lines.push(currentLine);
    }
  
    return lines;
}


// Function to draw text with word wrap
export const drawWrappedText = (page: any, font: PDFFont, text: string, x: number, startY: number, maxWidth: number,  fontSize: number ) => {

    // Use the helper function to split the text into lines
    const lines = splitTextIntoLines(text, maxWidth, fontSize, font);
  
    // Draw each line, adjusting the Y position for each line
    lines.forEach((line, index) => {
      page.drawText(line, {
        x, // Use the dynamic horizontal position
        y: startY - (index * fontSize), // Adjust vertical position for each line
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    });
  }
  