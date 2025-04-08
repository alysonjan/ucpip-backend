import fs from "fs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { drawWrappedText } from "../utils/helper";
import path from "path";

interface medicalCertificatePayload {
  student_id: string;
  document_type: string;
  name: string;
  address: string;
  date: string;
  age: string;
  sex: string;
  comment: string;
  remarks: string;
  status: string;
  doctor_fullname: string;
  doctor_signature: string;
  doctor_prc_license: string;
}

export const buildPDFDocsForMedicalCertificate = async (
  payload: medicalCertificatePayload,
  filePath: string
): Promise<void> => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Load the template PDF

  // const templatePath = `./public/v4/${payload.document_type}.pdf`;
  const baseDir = path.join(__dirname, "..");

  const templatePath = path.join(
    baseDir,
    "public",
    "v4",
    `${payload.document_type}.pdf`
  );

  const templateBytes = fs.readFileSync(templatePath);
  const templatePdf = await PDFDocument.load(templateBytes);

  // const imagePath = `./public/signatures/${payload.doctor_signature}`;
  // Construct the image path using the same approach.
  const imagePath = path.join(
    baseDir,
    "public",
    "signatures", // Adjust the directory to match the case used in your working code.
    `${payload.doctor_signature}`
  );
  const imageBytes = fs.readFileSync(imagePath);
  // Embed the image
  const image = await pdfDoc.embedPng(imageBytes); // or embedJpg depending on the image format

  // Get the first page from the template PDF
  const [templatePage] = await pdfDoc.copyPages(templatePdf, [0]);

  // Add the copied template page to the new PDF document
  pdfDoc.addPage(templatePage);

  // Draw dynamic content on the new PDF page
  const page = pdfDoc.getPage(0); // Get the first (and only) page in the new PDF
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // ******** FULLNAME ********
  page.drawText(payload.name.toUpperCase(), {
    x: 90, // The horizontal position (left-to-right)
    y: 615, // Lowering the vertical position (move lower on the page)
    size: 12,
    color: rgb(0, 0, 0),
  });

  // ******** DATE ********
  page.drawText(payload.date.toUpperCase(), {
    x: 450, // The horizontal position (left-to-right)
    y: 615, // Lowering the vertical position (move lower on the page)
    size: 12,
    color: rgb(0, 0, 0),
  });

  // ******** ADDRESS ********
  page.drawText(payload.address.toUpperCase(), {
    x: 105, // The horizontal position (left-to-right)
    y: 600, // Lowering the vertical position (move lower on the page)
    size: 12,
    color: rgb(0, 0, 0),
  });

  // ******** AGE | SEX ********
  page.drawText(`${payload.age} | ${payload.sex.toUpperCase()}`, {
    x: 460, // The horizontal position (left-to-r.toUpperCase()ight)
    y: 600, // Lowering the vertical position (move lower on the page)
    size: 12,
    color: rgb(0, 0, 0),
  });

  drawWrappedText(page, font, payload.status.toUpperCase(), 60, 440, 500, 11);

  drawWrappedText(page, font, payload.remarks.toUpperCase(), 60, 330, 500, 11);

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
    color: rgb(0, 0, 0),
  });

  page.drawText(`PRC License # ${payload.doctor_prc_license.toUpperCase()}`, {
    x: 90, // The horizontal position (left-to-right)
    y: 235, // Lowering the vertical position (move lower on the page)
    size: 10,
    color: rgb(0, 0, 0),
  });

  // page.drawText(payload.doctor_signature.toUpperCase(), {
  //   x: 70, // The horizontal position (left-to-right)
  //   y: 240, // Lowering the vertical position (move lower on the page)
  //   size: 10,
  //   color: rgb(0, 0, 0),
  // });
  // Draw the image on the page at position (x, y)

  // Save the PDF to the specified file path
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, pdfBytes);
};

// ##############################################  buildPDFDocsForClinicNote ##############################################

// Define the payload type
interface ReferralFormPayload {
  student_id: string;
  document_type: string;
  pe_no: string;
  date: string;
  name: string;
  age: string;
  sex: string;
  address: string;
  department: string;
  section: string;
  contact_number: string;
  phinma_email: string;
  chief_complaint: string;
  working_dx: string;
  blood_pressure: string;
  pulse_rate: string;
  respiratory: string;
  temperature: string;
  spO2: string;
  signs_and_symptoms: string;
  allergies: string;
  medications: string;
  past_medical_history: string;
  last_oral_intake: string;
  event_loading_to_injury: string;
  management: string;
  remarks: string;
  reason_for_consultation: string;
  doctor_fullname: string;
  doctor_signature: string;
  doctor_prc_license: string;
}

export const buildPDFDocsForReferralForm = async (
  payload: ReferralFormPayload,
  filePath: string
): Promise<void> => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Load the template PDF
  // const templatePath = `./public/v3/${payload.document_type}.pdf`;

  const baseDir = path.join(__dirname, "..");

  const templatePath = path.join(
    baseDir,
    "public",
    "v3",
    `${payload.document_type}.pdf`
  );

  const templateBytes = fs.readFileSync(templatePath);
  const templatePdf = await PDFDocument.load(templateBytes);

  // Get the first page from the template PDF
  const [templatePage] = await pdfDoc.copyPages(templatePdf, [0]);

  // const imagePath = `./public/signatures/${payload.doctor_signature}`;
  const imagePath = path.join(
    baseDir,
    "public",
    "signatures", // Adjust the directory to match the case used in your working code.
    `${payload.doctor_signature}`
  );

  const imageBytes = fs.readFileSync(imagePath);
  // Embed the image
  const image = await pdfDoc.embedPng(imageBytes); // or embedJpg depending on the image format

  // Add the copied template page to the new PDF document
  pdfDoc.addPage(templatePage);

  // Draw dynamic content on the new PDF page
  const page = pdfDoc.getPage(0); // Get the first (and only) page in the new PDF
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // ******** PE NO ********
  page.drawText(payload.pe_no, {
    x: 104, // The horizontal position (left-to-right)
    y: 600, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** DATE ********
  page.drawText(payload.date, {
    x: 456, // The horizontal position (left-to-right)
    y: 588, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** FULLNAME ********
  page.drawText(payload.name.toUpperCase(), {
    x: 104, // The horizontal position (left-to-right)
    y: 574, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** ADDRESS ********
  page.drawText(payload.address.toUpperCase(), {
    x: 104, // The horizontal position (left-to-right)
    y: 558, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  drawWrappedText(
    page,
    font,
    payload.department.toUpperCase(),
    330,
    560,
    113,
    8
  );

  // ******** AGE ********
  page.drawText(payload.age, {
    x: 420, // The horizontal position (left-to-right)
    y: 573, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** SEX ********
  page.drawText(payload.sex.toUpperCase(), {
    x: 490, // The horizontal position (left-to-right)
    y: 573, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** SECTION ********
  page.drawText(payload.section, {
    x: 490, // The horizontal position (left-to-right)
    y: 558, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** CONTACT NUMBER ********
  page.drawText(payload.contact_number, {
    x: 195, // The horizontal position (left-to-right)
    y: 545, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** PHINMA EMAIL ********
  page.drawText(payload.phinma_email.toUpperCase(), {
    x: 380, // The horizontal position (left-to-right)
    y: 545, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  drawWrappedText(
    page,
    font,
    payload.chief_complaint.toUpperCase(),
    148,
    513,
    200,
    8
  );

  // ******** WORKING DX ********
  page.drawText(payload.working_dx.toUpperCase(), {
    x: 145, // The horizontal position (left-to-right)
    y: 493, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** BLOOD PRESSURE ********
  page.drawText(payload.blood_pressure, {
    x: 420, // The horizontal position (left-to-right)
    y: 492, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** PULSE RATE ********
  page.drawText(payload.pulse_rate, {
    x: 420, // The horizontal position (left-to-right)
    y: 478, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** RESPIRATORY ********
  page.drawText(payload.respiratory, {
    x: 420, // The horizontal position (left-to-right)
    y: 465, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** TEMPERATURE ********
  page.drawText(payload.temperature, {
    x: 420, // The horizontal position (left-to-right)
    y: 450, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** spO2 ********
  page.drawText(payload.spO2, {
    x: 420, // The horizontal position (left-to-right)
    y: 438, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** SIGNS AND SYMPTOMS ********
  page.drawText(payload.signs_and_symptoms.toUpperCase(), {
    x: 195, // The horizontal position (left-to-right)
    y: 404, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** ALLERGIES ********
  page.drawText(payload.allergies.toUpperCase(), {
    x: 158, // The horizontal position (left-to-right)
    y: 390, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** MEDICATIONS ********
  page.drawText(payload.medications.toUpperCase(), {
    x: 167, // The horizontal position (left-to-right)
    y: 379, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** MEDICAL HISTORY ********
  page.drawText(payload.past_medical_history.toUpperCase(), {
    x: 210, // The horizontal position (left-to-right)
    y: 365, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  drawWrappedText(page, font, payload.remarks.toUpperCase(), 110, 333, 500, 8);

  drawWrappedText(
    page,
    font,
    payload.reason_for_consultation.toUpperCase(),
    110,
    230,
    500,
    8
  );

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
    color: rgb(0, 0, 0),
  });

  page.drawText(`PRC License # ${payload.doctor_prc_license.toUpperCase()}`, {
    x: 100, // The horizontal position (left-to-right)
    y: 73, // Lowering the vertical position (move lower on the page)
    size: 10,
    color: rgb(0, 0, 0),
  });

  // Save the PDF to the specified file path
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, pdfBytes);
};

// Define the payload type
interface ClinicNotePayload {
  student_id: string;
  document_type: string;
  pe_no: string;
  date: string;
  name: string;
  age: string;
  sex: string;
  address: string;
  department: string;
  section: string;
  contact_number: string;
  phinma_email: string;
  chief_complaint: string;
  working_dx: string;
  blood_pressure: string;
  pulse_rate: string;
  respiratory: string;
  temperature: string;
  spO2: string;
  signs_and_symptoms: string;
  allergies: string;
  medications: string;
  past_medical_history: string;
  last_oral_intake: string;
  event_loading_to_injury: string;
  management: string;
  remarks: string;
  doctor_fullname: string;
  doctor_signature: string;
  doctor_prc_license: string;
}

export const buildPDFDocsForClinicNote = async (
  payload: ClinicNotePayload,
  filePath: string
): Promise<void> => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Load the template PDF
  // const templatePath = `./public/v3/${payload.document_type}.pdf`;

  const baseDir = path.join(__dirname, "..");

  const templatePath = path.join(
    baseDir,
    "public",
    "v3",
    `${payload.document_type}.pdf`
  );

  const templateBytes = fs.readFileSync(templatePath);
  const templatePdf = await PDFDocument.load(templateBytes);

  // Get the first page from the template PDF
  const [templatePage] = await pdfDoc.copyPages(templatePdf, [0]);

  // const imagePath = `./public/signatures/${payload.doctor_signature}`;
  const imagePath = path.join(
    baseDir,
    "public",
    "signatures", // Adjust the directory to match the case used in your working code.
    `${payload.doctor_signature}`
  );

  const imageBytes = fs.readFileSync(imagePath);
  // Embed the image
  const image = await pdfDoc.embedPng(imageBytes); // or embedJpg depending on the image format

  // Add the copied template page to the new PDF document
  pdfDoc.addPage(templatePage);

  // Draw dynamic content on the new PDF page
  const page = pdfDoc.getPage(0); // Get the first (and only) page in the new PDF
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // ******** PE NO ********
  page.drawText(payload.pe_no, {
    x: 104, // The horizontal position (left-to-right)
    y: 600, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** DATE ********
  page.drawText(payload.date, {
    x: 456, // The horizontal position (left-to-right)
    y: 588, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** FULLNAME ********
  page.drawText(payload.name.toUpperCase(), {
    x: 104, // The horizontal position (left-to-right)
    y: 574, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** ADDRESS ********
  page.drawText(payload.address.toUpperCase(), {
    x: 104, // The horizontal position (left-to-right)
    y: 558, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  drawWrappedText(
    page,
    font,
    payload.department.toUpperCase(),
    330,
    560,
    113,
    8
  );

  // ******** AGE ********
  page.drawText(payload.age, {
    x: 420, // The horizontal position (left-to-right)
    y: 573, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** SEX ********
  page.drawText(payload.sex.toUpperCase(), {
    x: 490, // The horizontal position (left-to-right)
    y: 573, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** SECTION ********
  page.drawText(payload.section, {
    x: 490, // The horizontal position (left-to-right)
    y: 558, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** CONTACT NUMBER ********
  page.drawText(payload.contact_number, {
    x: 195, // The horizontal position (left-to-right)
    y: 545, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** PHINMA EMAIL ********
  page.drawText(payload.phinma_email.toUpperCase(), {
    x: 380, // The horizontal position (left-to-right)
    y: 545, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  drawWrappedText(
    page,
    font,
    payload.chief_complaint.toUpperCase(),
    145,
    512,
    200,
    8
  );

  // ******** WORKING DX ********
  page.drawText(payload.working_dx.toUpperCase(), {
    x: 110, // The horizontal position (left-to-right)
    y: 480, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** BLOOD PRESSURE ********
  page.drawText(payload.blood_pressure, {
    x: 420, // The horizontal position (left-to-right)
    y: 490, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** PULSE RATE ********
  page.drawText(payload.pulse_rate, {
    x: 420, // The horizontal position (left-to-right)
    y: 478, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** RESPIRATORY ********
  page.drawText(payload.respiratory, {
    x: 420, // The horizontal position (left-to-right)
    y: 465, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** TEMPERATURE ********
  page.drawText(payload.temperature, {
    x: 420, // The horizontal position (left-to-right)
    y: 450, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** spO2 ********
  page.drawText(payload.spO2, {
    x: 420, // The horizontal position (left-to-right)
    y: 435, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** SIGNS AND SYMPTOMS ********
  page.drawText(payload.signs_and_symptoms.toUpperCase(), {
    x: 200, // The horizontal position (left-to-right)
    y: 400, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** ALLERGIES ********
  page.drawText(payload.allergies.toUpperCase(), {
    x: 200, // The horizontal position (left-to-right)
    y: 385, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** MEDICATIONS ********
  page.drawText(payload.medications.toUpperCase(), {
    x: 200, // The horizontal position (left-to-right)
    y: 375, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** MEDICAL HISTORY ********
  page.drawText(payload.past_medical_history.toUpperCase(), {
    x: 200, // The horizontal position (left-to-right)
    y: 362, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  drawWrappedText(page, font, payload.remarks.toUpperCase(), 110, 333, 500, 8);

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
    color: rgb(0, 0, 0),
  });

  page.drawText(`PRC License # ${payload.doctor_prc_license.toUpperCase()}`, {
    x: 100, // The horizontal position (left-to-right)
    y: 130, // Lowering the vertical position (move lower on the page)
    size: 10,
    color: rgb(0, 0, 0),
  });

  // Save the PDF to the specified file path
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, pdfBytes);
};

// ##############################################  buildPDFDocsForPhysicalExamForm ##############################################

// Define the payload type
interface PhysicalExamReportPayload {
  student_id: string;
  document_type: string;
  pe_no: string;
  date: string;
  name: string;
  age: string;
  sex: string;
  address: string;
  department: string;
  section: string;
  contact_number: string;
  phinma_email: string;
  blood_pressure: string;
  pulse_rate: string;
  respiratory: string;
  temperature: string;
  spO2: string;
  remarks: string;
  doctor_fullname: string;
  doctor_signature: string;
  doctor_prc_license: string;
}

export const buildPDFDocsForPhysicalExamForm = async (
  payload: PhysicalExamReportPayload,
  filePath: string
): Promise<void> => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Load the template PDF
  // const templatePath = `./public/v4/${payload.document_type}.pdf`;

  const baseDir = path.join(__dirname, "..");

  const templatePath = path.join(
    baseDir,
    "public",
    "v4",
    `${payload.document_type}.pdf`
  );

  const templateBytes = fs.readFileSync(templatePath);
  const templatePdf = await PDFDocument.load(templateBytes);

  // Get the first page from the template PDF
  const [templatePage] = await pdfDoc.copyPages(templatePdf, [0]);

  // const imagePath = `./public/signatures/${payload.doctor_signature}`;
  const imagePath = path.join(
    baseDir,
    "public",
    "signatures", // Adjust the directory to match the case used in your working code.
    `${payload.doctor_signature}`
  );

  const imageBytes = fs.readFileSync(imagePath);
  // Embed the image
  const image = await pdfDoc.embedPng(imageBytes); // or embedJpg depending on the image format

  // Add the copied template page to the new PDF document
  pdfDoc.addPage(templatePage);

  // Draw dynamic content on the new PDF page
  const page = pdfDoc.getPage(0); // Get the first (and only) page in the new PDF
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // ******** PE NO ********
  page.drawText(payload.pe_no, {
    x: 115, // The horizontal position (left-to-right)
    y: 593, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** DATE ********
  page.drawText(payload.date, {
    x: 456, // The horizontal position (left-to-right)
    y: 580, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** FULLNAME ********
  page.drawText(payload.name.toUpperCase(), {
    x: 110, // The horizontal position (left-to-right)
    y: 565, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** ADDRESS ********
  page.drawText(payload.address.toUpperCase(), {
    x: 108, // The horizontal position (left-to-right)
    y: 550, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  drawWrappedText(
    page,
    font,
    payload.department.toUpperCase(),
    345,
    552,
    113,
    8
  );

  // ******** AGE ********
  page.drawText(payload.age, {
    x: 420, // The horizontal position (left-to-right)
    y: 565, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** SEX ********
  page.drawText(payload.sex.toUpperCase(), {
    x: 490, // The horizontal position (left-to-right)
    y: 565, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** SECTION ********
  page.drawText(payload.section, {
    x: 490, // The horizontal position (left-to-right)
    y: 550, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** CONTACT NUMBER ********
  page.drawText(payload.contact_number, {
    x: 195, // The horizontal position (left-to-right)
    y: 535, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** PHINMA EMAIL ********
  page.drawText(payload.phinma_email.toUpperCase(), {
    x: 380, // The horizontal position (left-to-right)
    y: 535, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** BLOOD PRESSURE ********
  page.drawText(payload.blood_pressure, {
    x: 155, // The horizontal position (left-to-right)
    y: 495, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** PULSE RATE ********
  page.drawText(payload.pulse_rate, {
    x: 155, // The horizontal position (left-to-right)
    y: 483, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** RESPIRATORY ********
  page.drawText(payload.respiratory, {
    x: 155, // The horizontal position (left-to-right)
    y: 471, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** TEMPERATURE ********
  page.drawText(payload.temperature, {
    x: 155, // The horizontal position (left-to-right)
    y: 457, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  // ******** spO2 ********
  page.drawText(payload.spO2, {
    x: 155, // The horizontal position (left-to-right)
    y: 445, // Lowering the vertical position (move lower on the page)
    size: 8,
    color: rgb(0, 0, 0),
  });

  drawWrappedText(page, font, payload.remarks.toUpperCase(), 155, 333, 500, 8);

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
    color: rgb(0, 0, 0),
  });

  page.drawText(`PRC License # ${payload.doctor_prc_license.toUpperCase()}`, {
    x: 100, // The horizontal position (left-to-right)
    y: 180, // Lowering the vertical position (move lower on the page)
    size: 10,
    color: rgb(0, 0, 0),
  });

  // Save the PDF to the specified file path
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, pdfBytes);
};
