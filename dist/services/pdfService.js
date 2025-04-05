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
exports.buildPDFDocsForPhysicalExamForm = exports.buildPDFDocsForClinicNote = exports.buildPDFDocsForReferralForm = exports.buildPDFDocsForMedicalCertificate = void 0;
const fs_1 = __importDefault(require("fs"));
const pdf_lib_1 = require("pdf-lib");
const helper_1 = require("../utils/helper");
const buildPDFDocsForMedicalCertificate = (payload, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a new PDF document
    const pdfDoc = yield pdf_lib_1.PDFDocument.create();
    // Load the template PDF
    // const templatePath = `./public/templates/${payload.document_type}.pdf`; // Adjust the path as needed
    const templatePath = `./public/v4/${payload.document_type}.pdf`; // Adjust the path as needed
    const templateBytes = fs_1.default.readFileSync(templatePath);
    const templatePdf = yield pdf_lib_1.PDFDocument.load(templateBytes);
    const imagePath = `./public/signatures/${payload.doctor_signature}`;
    const imageBytes = fs_1.default.readFileSync(imagePath);
    // Embed the image
    const image = yield pdfDoc.embedPng(imageBytes); // or embedJpg depending on the image format
    // Get the first page from the template PDF
    const [templatePage] = yield pdfDoc.copyPages(templatePdf, [0]);
    // Add the copied template page to the new PDF document
    pdfDoc.addPage(templatePage);
    // Draw dynamic content on the new PDF page
    const page = pdfDoc.getPage(0); // Get the first (and only) page in the new PDF
    const font = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
    // ******** FULLNAME ********
    page.drawText(payload.name.toUpperCase(), {
        x: 90, // The horizontal position (left-to-right)
        y: 615, // Lowering the vertical position (move lower on the page)
        size: 12,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** DATE ********
    page.drawText(payload.date.toUpperCase(), {
        x: 450, // The horizontal position (left-to-right)
        y: 615, // Lowering the vertical position (move lower on the page)
        size: 12,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** ADDRESS ********
    page.drawText(payload.address.toUpperCase(), {
        x: 105, // The horizontal position (left-to-right)
        y: 600, // Lowering the vertical position (move lower on the page)
        size: 12,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** AGE | SEX ********
    page.drawText(`${payload.age} | ${payload.sex.toUpperCase()}`, {
        x: 460, // The horizontal position (left-to-r.toUpperCase()ight)
        y: 600, // Lowering the vertical position (move lower on the page)
        size: 12,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    (0, helper_1.drawWrappedText)(page, font, payload.status.toUpperCase(), 60, 440, 500, 11);
    (0, helper_1.drawWrappedText)(page, font, payload.remarks.toUpperCase(), 60, 330, 500, 11);
    // ******** DOCTOR ********
    page.drawImage(image, {
        x: 90,
        y: 220,
        width: 100, // Adjust the width as needed
        height: 100, // Adjust the height as needed
    });
    page.drawText(payload.doctor_fullname.toUpperCase(), {
        x: 90, // The horizontal position (left-to-right)
        y: 250, // Lowering the vertical position (move lower on the page)
        size: 10,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    page.drawText(`PRC License # ${payload.doctor_prc_license.toUpperCase()}`, {
        x: 90, // The horizontal position (left-to-right)
        y: 235, // Lowering the vertical position (move lower on the page)
        size: 10,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // page.drawText(payload.doctor_signature.toUpperCase(), {
    //   x: 70, // The horizontal position (left-to-right)
    //   y: 240, // Lowering the vertical position (move lower on the page)
    //   size: 10,
    //   color: rgb(0, 0, 0),
    // });
    // Draw the image on the page at position (x, y)
    // Save the PDF to the specified file path
    const pdfBytes = yield pdfDoc.save();
    fs_1.default.writeFileSync(filePath, pdfBytes);
});
exports.buildPDFDocsForMedicalCertificate = buildPDFDocsForMedicalCertificate;
const buildPDFDocsForReferralForm = (payload, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a new PDF document
    const pdfDoc = yield pdf_lib_1.PDFDocument.create();
    // Load the template PDF
    const templatePath = `./public/v3/${payload.document_type}.pdf`; // Adjust the path as needed
    const templateBytes = fs_1.default.readFileSync(templatePath);
    const templatePdf = yield pdf_lib_1.PDFDocument.load(templateBytes);
    // Get the first page from the template PDF
    const [templatePage] = yield pdfDoc.copyPages(templatePdf, [0]);
    const imagePath = `./public/signatures/${payload.doctor_signature}`;
    const imageBytes = fs_1.default.readFileSync(imagePath);
    // Embed the image
    const image = yield pdfDoc.embedPng(imageBytes); // or embedJpg depending on the image format
    // Add the copied template page to the new PDF document
    pdfDoc.addPage(templatePage);
    // Draw dynamic content on the new PDF page
    const page = pdfDoc.getPage(0); // Get the first (and only) page in the new PDF
    const font = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
    // ******** PE NO ********
    page.drawText(payload.pe_no, {
        x: 104, // The horizontal position (left-to-right)
        y: 600, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** DATE ********
    page.drawText(payload.date, {
        x: 456, // The horizontal position (left-to-right)
        y: 588, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** FULLNAME ********
    page.drawText(payload.name.toUpperCase(), {
        x: 104, // The horizontal position (left-to-right)
        y: 574, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** ADDRESS ********
    page.drawText(payload.address.toUpperCase(), {
        x: 104, // The horizontal position (left-to-right)
        y: 558, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    (0, helper_1.drawWrappedText)(page, font, payload.department.toUpperCase(), 330, 560, 113, 8);
    // ******** AGE ********
    page.drawText(payload.age, {
        x: 420, // The horizontal position (left-to-right)
        y: 573, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** SEX ********
    page.drawText(payload.sex.toUpperCase(), {
        x: 490, // The horizontal position (left-to-right)
        y: 573, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** SECTION ********
    page.drawText(payload.section, {
        x: 490, // The horizontal position (left-to-right)
        y: 558, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** CONTACT NUMBER ********
    page.drawText(payload.contact_number, {
        x: 195, // The horizontal position (left-to-right)
        y: 545, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** PHINMA EMAIL ********
    page.drawText(payload.phinma_email.toUpperCase(), {
        x: 380, // The horizontal position (left-to-right)
        y: 545, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    (0, helper_1.drawWrappedText)(page, font, payload.chief_complaint.toUpperCase(), 148, 513, 200, 8);
    // ******** WORKING DX ********
    page.drawText(payload.working_dx.toUpperCase(), {
        x: 145, // The horizontal position (left-to-right)
        y: 493, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** BLOOD PRESSURE ********
    page.drawText(payload.blood_pressure, {
        x: 420, // The horizontal position (left-to-right)
        y: 492, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** PULSE RATE ********
    page.drawText(payload.pulse_rate, {
        x: 420, // The horizontal position (left-to-right)
        y: 478, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** RESPIRATORY ********
    page.drawText(payload.respiratory, {
        x: 420, // The horizontal position (left-to-right)
        y: 465, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** TEMPERATURE ********
    page.drawText(payload.temperature, {
        x: 420, // The horizontal position (left-to-right)
        y: 450, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** spO2 ********
    page.drawText(payload.spO2, {
        x: 420, // The horizontal position (left-to-right)
        y: 438, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** SIGNS AND SYMPTOMS ********
    page.drawText(payload.signs_and_symptoms.toUpperCase(), {
        x: 195, // The horizontal position (left-to-right)
        y: 404, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** ALLERGIES ********
    page.drawText(payload.allergies.toUpperCase(), {
        x: 158, // The horizontal position (left-to-right)
        y: 390, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** MEDICATIONS ********
    page.drawText(payload.medications.toUpperCase(), {
        x: 167, // The horizontal position (left-to-right)
        y: 379, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** MEDICAL HISTORY ********
    page.drawText(payload.past_medical_history.toUpperCase(), {
        x: 210, // The horizontal position (left-to-right)
        y: 365, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    (0, helper_1.drawWrappedText)(page, font, payload.remarks.toUpperCase(), 110, 333, 500, 8);
    (0, helper_1.drawWrappedText)(page, font, payload.reason_for_consultation.toUpperCase(), 110, 230, 500, 8);
    // ******** DOCTOR ********
    // page.drawImage(image, {
    //   x: 130,
    //   y: 120,
    //   width: 100, // Adjust the width as needed
    //   height: 100, // Adjust the height as needed
    // });
    // page.drawText(payload.doctor_fullname.toUpperCase(), {
    //   x: 130, // The horizontal position (left-to-right)
    //   y: 157, // Lowering the vertical position (move lower on the page)
    //   size: 8,
    //   color: rgb(0, 0, 0),
    // });
    // ******** DOCTOR ********
    page.drawImage(image, {
        x: 100,
        y: 80,
        width: 100, // Adjust the width as needed
        height: 100, // Adjust the height as needed
    });
    page.drawText(payload.doctor_fullname.toUpperCase(), {
        x: 100, // The horizontal position (left-to-right)
        y: 83, // Lowering the vertical position (move lower on the page)
        size: 10,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    page.drawText(`PRC License # ${payload.doctor_prc_license.toUpperCase()}`, {
        x: 100, // The horizontal position (left-to-right)
        y: 73, // Lowering the vertical position (move lower on the page)
        size: 10,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // Save the PDF to the specified file path
    const pdfBytes = yield pdfDoc.save();
    fs_1.default.writeFileSync(filePath, pdfBytes);
});
exports.buildPDFDocsForReferralForm = buildPDFDocsForReferralForm;
const buildPDFDocsForClinicNote = (payload, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a new PDF document
    const pdfDoc = yield pdf_lib_1.PDFDocument.create();
    // Load the template PDF
    const templatePath = `./public/v3/${payload.document_type}.pdf`; // Adjust the path as needed
    const templateBytes = fs_1.default.readFileSync(templatePath);
    const templatePdf = yield pdf_lib_1.PDFDocument.load(templateBytes);
    // Get the first page from the template PDF
    const [templatePage] = yield pdfDoc.copyPages(templatePdf, [0]);
    const imagePath = `./public/signatures/${payload.doctor_signature}`;
    const imageBytes = fs_1.default.readFileSync(imagePath);
    // Embed the image
    const image = yield pdfDoc.embedPng(imageBytes); // or embedJpg depending on the image format
    // Add the copied template page to the new PDF document
    pdfDoc.addPage(templatePage);
    // Draw dynamic content on the new PDF page
    const page = pdfDoc.getPage(0); // Get the first (and only) page in the new PDF
    const font = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
    // ******** PE NO ********
    page.drawText(payload.pe_no, {
        x: 104, // The horizontal position (left-to-right)
        y: 600, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** DATE ********
    page.drawText(payload.date, {
        x: 456, // The horizontal position (left-to-right)
        y: 588, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** FULLNAME ********
    page.drawText(payload.name.toUpperCase(), {
        x: 104, // The horizontal position (left-to-right)
        y: 574, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** ADDRESS ********
    page.drawText(payload.address.toUpperCase(), {
        x: 104, // The horizontal position (left-to-right)
        y: 558, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    (0, helper_1.drawWrappedText)(page, font, payload.department.toUpperCase(), 330, 560, 113, 8);
    // ******** AGE ********
    page.drawText(payload.age, {
        x: 420, // The horizontal position (left-to-right)
        y: 573, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** SEX ********
    page.drawText(payload.sex.toUpperCase(), {
        x: 490, // The horizontal position (left-to-right)
        y: 573, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** SECTION ********
    page.drawText(payload.section, {
        x: 490, // The horizontal position (left-to-right)
        y: 558, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** CONTACT NUMBER ********
    page.drawText(payload.contact_number, {
        x: 195, // The horizontal position (left-to-right)
        y: 545, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** PHINMA EMAIL ********
    page.drawText(payload.phinma_email.toUpperCase(), {
        x: 380, // The horizontal position (left-to-right)
        y: 545, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    (0, helper_1.drawWrappedText)(page, font, payload.chief_complaint.toUpperCase(), 145, 512, 200, 8);
    // ******** WORKING DX ********
    page.drawText(payload.working_dx.toUpperCase(), {
        x: 110, // The horizontal position (left-to-right)
        y: 480, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** BLOOD PRESSURE ********
    page.drawText(payload.blood_pressure, {
        x: 420, // The horizontal position (left-to-right)
        y: 490, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** PULSE RATE ********
    page.drawText(payload.pulse_rate, {
        x: 420, // The horizontal position (left-to-right)
        y: 478, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** RESPIRATORY ********
    page.drawText(payload.respiratory, {
        x: 420, // The horizontal position (left-to-right)
        y: 465, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** TEMPERATURE ********
    page.drawText(payload.temperature, {
        x: 420, // The horizontal position (left-to-right)
        y: 450, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** spO2 ********
    page.drawText(payload.spO2, {
        x: 420, // The horizontal position (left-to-right)
        y: 435, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** SIGNS AND SYMPTOMS ********
    page.drawText(payload.signs_and_symptoms.toUpperCase(), {
        x: 200, // The horizontal position (left-to-right)
        y: 400, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** ALLERGIES ********
    page.drawText(payload.allergies.toUpperCase(), {
        x: 200, // The horizontal position (left-to-right)
        y: 385, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** MEDICATIONS ********
    page.drawText(payload.medications.toUpperCase(), {
        x: 200, // The horizontal position (left-to-right)
        y: 375, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** MEDICAL HISTORY ********
    page.drawText(payload.past_medical_history.toUpperCase(), {
        x: 200, // The horizontal position (left-to-right)
        y: 362, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    (0, helper_1.drawWrappedText)(page, font, payload.remarks.toUpperCase(), 110, 333, 500, 8);
    // ******** DOCTOR ********
    // page.drawImage(image, {
    //   x: 130,
    //   y: 160,
    //   width: 80, // Adjust the width as needed
    //   height: 80, // Adjust the height as needed
    // });
    // page.drawText(payload.doctor_fullname.toUpperCase(), {
    //   x: 130, // The horizontal position (left-to-right)
    //   y: 180, // Lowering the vertical position (move lower on the page)
    //   size: 8,
    //   color: rgb(0, 0, 0),
    // });
    // ******** DOCTOR ********
    page.drawImage(image, {
        x: 110,
        y: 135,
        width: 100, // Adjust the width as needed
        height: 100, // Adjust the height as needed
    });
    page.drawText(payload.doctor_fullname.toUpperCase(), {
        x: 100, // The horizontal position (left-to-right)
        y: 140, // Lowering the vertical position (move lower on the page)
        size: 10,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    page.drawText(`PRC License # ${payload.doctor_prc_license.toUpperCase()}`, {
        x: 100, // The horizontal position (left-to-right)
        y: 130, // Lowering the vertical position (move lower on the page)
        size: 10,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // Save the PDF to the specified file path
    const pdfBytes = yield pdfDoc.save();
    fs_1.default.writeFileSync(filePath, pdfBytes);
});
exports.buildPDFDocsForClinicNote = buildPDFDocsForClinicNote;
const buildPDFDocsForPhysicalExamForm = (payload, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a new PDF document
    const pdfDoc = yield pdf_lib_1.PDFDocument.create();
    // Load the template PDF
    const templatePath = `./public/v4/${payload.document_type}.pdf`; // Adjust the path as needed
    const templateBytes = fs_1.default.readFileSync(templatePath);
    const templatePdf = yield pdf_lib_1.PDFDocument.load(templateBytes);
    // Get the first page from the template PDF
    const [templatePage] = yield pdfDoc.copyPages(templatePdf, [0]);
    const imagePath = `./public/signatures/${payload.doctor_signature}`;
    const imageBytes = fs_1.default.readFileSync(imagePath);
    // Embed the image
    const image = yield pdfDoc.embedPng(imageBytes); // or embedJpg depending on the image format
    // Add the copied template page to the new PDF document
    pdfDoc.addPage(templatePage);
    // Draw dynamic content on the new PDF page
    const page = pdfDoc.getPage(0); // Get the first (and only) page in the new PDF
    const font = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
    // ******** PE NO ********
    page.drawText(payload.pe_no, {
        x: 115, // The horizontal position (left-to-right)
        y: 593, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** DATE ********
    page.drawText(payload.date, {
        x: 456, // The horizontal position (left-to-right)
        y: 580, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** FULLNAME ********
    page.drawText(payload.name.toUpperCase(), {
        x: 110, // The horizontal position (left-to-right)
        y: 565, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** ADDRESS ********
    page.drawText(payload.address.toUpperCase(), {
        x: 108, // The horizontal position (left-to-right)
        y: 550, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    (0, helper_1.drawWrappedText)(page, font, payload.department.toUpperCase(), 345, 552, 113, 8);
    // ******** AGE ********
    page.drawText(payload.age, {
        x: 420, // The horizontal position (left-to-right)
        y: 565, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** SEX ********
    page.drawText(payload.sex.toUpperCase(), {
        x: 490, // The horizontal position (left-to-right)
        y: 565, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** SECTION ********
    page.drawText(payload.section, {
        x: 490, // The horizontal position (left-to-right)
        y: 550, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** CONTACT NUMBER ********
    page.drawText(payload.contact_number, {
        x: 195, // The horizontal position (left-to-right)
        y: 535, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** PHINMA EMAIL ********
    page.drawText(payload.phinma_email.toUpperCase(), {
        x: 380, // The horizontal position (left-to-right)
        y: 535, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** BLOOD PRESSURE ********
    page.drawText(payload.blood_pressure, {
        x: 155, // The horizontal position (left-to-right)
        y: 495, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** PULSE RATE ********
    page.drawText(payload.pulse_rate, {
        x: 155, // The horizontal position (left-to-right)
        y: 483, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** RESPIRATORY ********
    page.drawText(payload.respiratory, {
        x: 155, // The horizontal position (left-to-right)
        y: 471, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** TEMPERATURE ********
    page.drawText(payload.temperature, {
        x: 155, // The horizontal position (left-to-right)
        y: 457, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // ******** spO2 ********
    page.drawText(payload.spO2, {
        x: 155, // The horizontal position (left-to-right)
        y: 445, // Lowering the vertical position (move lower on the page)
        size: 8,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    (0, helper_1.drawWrappedText)(page, font, payload.remarks.toUpperCase(), 155, 333, 500, 8);
    // ******** DOCTOR ********
    // page.drawImage(image, {
    //   x: 130,
    //   y: 220,
    //   width: 80, // Adjust the width as needed
    //   height: 80, // Adjust the height as needed
    // });
    // page.drawText(payload.doctor_fullname.toUpperCase(), {
    //   x: 130, // The horizontal position (left-to-right)
    //   y: 245, // Lowering the vertical position (move lower on the page)
    //   size: 8,
    //   color: rgb(0, 0, 0),
    // });
    // ******** DOCTOR ********
    page.drawImage(image, {
        x: 100,
        y: 180,
        width: 100, // Adjust the width as needed
        height: 100, // Adjust the height as needed
    });
    page.drawText(payload.doctor_fullname.toUpperCase(), {
        x: 100, // The horizontal position (left-to-right)
        y: 190, // Lowering the vertical position (move lower on the page)
        size: 10,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    page.drawText(`PRC License # ${payload.doctor_prc_license.toUpperCase()}`, {
        x: 100, // The horizontal position (left-to-right)
        y: 180, // Lowering the vertical position (move lower on the page)
        size: 10,
        color: (0, pdf_lib_1.rgb)(0, 0, 0),
    });
    // Save the PDF to the specified file path
    const pdfBytes = yield pdfDoc.save();
    fs_1.default.writeFileSync(filePath, pdfBytes);
});
exports.buildPDFDocsForPhysicalExamForm = buildPDFDocsForPhysicalExamForm;
