"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPDFDocsForYearlyReport = void 0;
const fs_1 = __importDefault(require("fs"));
const pdf_lib_1 = require("pdf-lib");
// Define the payload type
// interface ReportPayload {
//   monthAndYear: string;
//   clinicName: string;
//   reportPeriod: string;
//   serviceOffered: string;
//   totalPatientsServed: number;
//   physicalExamPatients: string | number;
//   vaccinationPatients: string | number;
//   healthConcernConsultations: string | number;
//   newPatients: string | number;
//   returningPatients: string | number;
//   genderDistributionMale: string | number;
//   genderDistributionFemale: string | number;
//   department: Record<string, number>;
//   totalConsultations: string | number;
//   commonDiagnosis: string | number;
//   totalVaccinationsAdministered: string | number;
//   monthlyPatientDistribution: string | number;
// }
const buildPDFDocsForYearlyReport = (payload, outputFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a new PDF Document
        const pdfDoc = yield pdf_lib_1.PDFDocument.create();
        let page = pdfDoc.addPage([600, 800]); // Use 'let' here to allow reassignment
        // Set font and styles
        const helveticaFont = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
        const helveticaBoldFont = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.HelveticaBold);
        // Page dimensions
        const { width, height } = page.getSize();
        // Draw a border around the page
        const margin = 30;
        page.drawRectangle({
            x: margin,
            y: margin,
            width: width - 2 * margin,
            height: height - 2 * margin,
            borderColor: (0, pdf_lib_1.rgb)(0.8, 0.8, 0.8),
            borderWidth: 2,
        });
        // **Title: Southwestern University**
        const title = "SOUTHWESTERN UNIVERSITY";
        page.drawText(title, {
            x: (width - helveticaBoldFont.widthOfTextAtSize(title, 20)) / 2,
            y: height - 50, // Position near the top
            size: 20,
            font: helveticaBoldFont,
            color: (0, pdf_lib_1.rgb)(0.5, 0, 0),
        });
        // Add margin after the "Southwestern University" header
        const marginBottomAfterHeader = 30; // Define the margin size
        const subtitleY = height - 50 - marginBottomAfterHeader;
        // **Subtitle**
        page.drawText("PHINMA", {
            x: (width - helveticaFont.widthOfTextAtSize("PHINMA", 16)) / 2,
            y: subtitleY, // Adjusted Y position to account for the margin
            size: 16,
            font: helveticaFont,
        });
        // Title Section
        const titleText = "UCPIP - Yearly Clinic Report";
        const titleFontSize = 20;
        // Calculate the width of the title text to center it
        const titleWidth = helveticaBoldFont.widthOfTextAtSize(titleText, titleFontSize);
        const titleX = (width - titleWidth) / 2; // Center horizontally
        const titleY = subtitleY - 30; // Position below the subtitle with additional spacing
        page.drawText(titleText, {
            x: titleX,
            y: titleY,
            size: titleFontSize,
            font: helveticaBoldFont,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
        });
        // Helper function to wrap text and calculate required height
        const wrapText = (text, font, fontSize, maxWidth) => {
            const words = String(text).split(" ");
            const lines = [];
            let currentLine = words[0];
            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = font.widthOfTextAtSize(`${currentLine} ${word}`, fontSize);
                if (width < maxWidth) {
                    currentLine += ` ${word}`;
                }
                else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            return lines;
        };
        // Content to add in table format
        const tableData = [
            { label: "Month & Year", value: payload.monthAndYear },
            { label: "Clinic Name", value: payload.clinicName },
            { label: "Report Period", value: payload.reportPeriod },
            { label: "Service Offered", value: payload.serviceOffered },
            { label: "Total Patients Served", value: payload.totalPatientsServed },
            { label: "Physical Exam Patients", value: payload.physicalExamPatients },
            { label: "Vaccination Patients", value: payload.vaccinationPatients },
            { label: "Health Concern Consultations", value: payload.healthConcernConsultations },
            { label: "New Patients", value: payload.newPatients },
            { label: "Returning Patients", value: payload.returningPatients },
            { label: "Male Patients", value: payload.genderDistributionMale },
            { label: "Female Patients", value: payload.genderDistributionFemale },
            { label: "Total Consultations", value: payload.totalConsultations },
            { label: "Total Vaccinations", value: payload.totalVaccinationsAdministered },
        ];
        // Table settings
        const startY = titleY - 50;
        const baseRowHeight = 25;
        const colWidth = (width - 2 * margin) / 2;
        const fontSize = 10;
        const cellPadding = 5;
        const maxTextWidth = colWidth - 2 * cellPadding;
        // Draw table headers
        page.drawRectangle({
            x: margin,
            y: startY,
            width: colWidth,
            height: baseRowHeight,
            borderColor: (0, pdf_lib_1.rgb)(0, 0, 0),
            borderWidth: 1,
        });
        page.drawRectangle({
            x: margin + colWidth,
            y: startY,
            width: colWidth,
            height: baseRowHeight,
            borderColor: (0, pdf_lib_1.rgb)(0, 0, 0),
            borderWidth: 1,
        });
        page.drawText("Category", {
            x: margin + cellPadding,
            y: startY + baseRowHeight / 2 - fontSize / 2,
            size: fontSize,
            font: helveticaBoldFont,
        });
        page.drawText("Value", {
            x: margin + colWidth + cellPadding,
            y: startY + baseRowHeight / 2 - fontSize / 2,
            size: fontSize,
            font: helveticaBoldFont,
        });
        // Draw table rows with dynamic heights
        let tableY = startY;
        tableData.forEach((row) => {
            // Wrap text for both label and value
            const labelLines = wrapText(row.label, helveticaFont, fontSize, maxTextWidth);
            const valueLines = wrapText(row.value, helveticaFont, fontSize, maxTextWidth);
            // Calculate row height based on the maximum number of lines
            const maxLines = Math.max(labelLines.length, valueLines.length);
            const rowHeight = Math.max(baseRowHeight, maxLines * (fontSize + 2) + 2 * cellPadding);
            tableY -= rowHeight;
            // Draw cell borders
            page.drawRectangle({
                x: margin,
                y: tableY,
                width: colWidth,
                height: rowHeight,
                borderColor: (0, pdf_lib_1.rgb)(0, 0, 0),
                borderWidth: 1,
            });
            page.drawRectangle({
                x: margin + colWidth,
                y: tableY,
                width: colWidth,
                height: rowHeight,
                borderColor: (0, pdf_lib_1.rgb)(0, 0, 0),
                borderWidth: 1,
            });
            // Draw label text
            labelLines.forEach((line, index) => {
                page.drawText(line, {
                    x: margin + cellPadding,
                    y: tableY + rowHeight - cellPadding - (fontSize + 2) * (index + 1),
                    size: fontSize,
                    font: helveticaFont,
                });
            });
            // Draw value text
            valueLines.forEach((line, index) => {
                page.drawText(line, {
                    x: margin + colWidth + cellPadding,
                    y: tableY + rowHeight - cellPadding - (fontSize + 2) * (index + 1),
                    size: fontSize,
                    font: helveticaFont,
                });
            });
        });
        // Add a new page for additional information
        page = pdfDoc.addPage([600, 800]);
        // Draw border on new page
        page.drawRectangle({
            x: margin,
            y: margin,
            width: width - 2 * margin,
            height: height - 2 * margin,
            borderColor: (0, pdf_lib_1.rgb)(0.8, 0.8, 0.8),
            borderWidth: 2,
        });
        // Additional Information Title
        const additionalInfoTitle = "Additional Information";
        const additionalInfoTitleWidth = helveticaBoldFont.widthOfTextAtSize(additionalInfoTitle, titleFontSize);
        const additionalInfoTitleX = (width - additionalInfoTitleWidth) / 2;
        page.drawText(additionalInfoTitle, {
            x: additionalInfoTitleX,
            y: height - 50,
            size: titleFontSize,
            font: helveticaBoldFont,
        });
        // Draw Monthly Patient Distribution
        let currentY = height - 100;
        page.drawText("Monthly Patient Distribution:", {
            x: margin + 10,
            y: currentY,
            size: 12,
            font: helveticaBoldFont,
        });
        currentY -= 20;
        payload.monthlyPatientDistribution.split(", ").forEach((item) => {
            page.drawText(`• ${item}`, {
                x: margin + 20,
                y: currentY,
                size: 10,
                font: helveticaFont,
            });
            currentY -= 15;
        });
        currentY -= 20;
        // Draw Departments
        page.drawText("Departments:", {
            x: margin + 10,
            y: currentY,
            size: 12,
            font: helveticaBoldFont,
        });
        currentY -= 20;
        Object.entries(payload.department).forEach(([key, value]) => {
            page.drawText(`• ${key}: ${value}`, {
                x: margin + 20,
                y: currentY,
                size: 10,
                font: helveticaFont,
            });
            currentY -= 15;
        });
        currentY -= 20;
        // Draw Common Diagnosis
        page.drawText("Common Diagnosis:", {
            x: margin + 10,
            y: currentY,
            size: 12,
            font: helveticaBoldFont,
        });
        currentY -= 20;
        payload.commonDiagnosis.split(", ").forEach((item) => {
            page.drawText(`• ${item}`, {
                x: margin + 20,
                y: currentY,
                size: 10,
                font: helveticaFont,
            });
            currentY -= 15;
        });
        // Save the document
        const pdfBytes = yield pdfDoc.save();
        // Write to file
        fs_1.default.writeFileSync(outputFilePath, pdfBytes);
        console.log("✅ PDF Generated Successfully:", outputFilePath);
    }
    catch (error) {
        console.error("❌ Error generating PDF:", error);
        throw new Error("Failed to generate PDF");
    }
});
exports.buildPDFDocsForYearlyReport = buildPDFDocsForYearlyReport;
