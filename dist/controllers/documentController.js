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
exports.printDocs = void 0;
const pdfService_1 = require("../services/pdfService");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Documents_1 = require("../models/Documents");
const commonService_1 = require("../services/commonService");
const User_1 = require("../models/User");
const PatientAdmission_1 = require("../models/PatientAdmission");
// Your printMedCert function
const printDocs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { student_id, document_type, doctor_id } = req.body;
        // check user id first
        const isUserExists = yield (0, User_1.getUserByStudentId)(student_id); // Await the promise to get the result
        if (!isUserExists) {
            return res.status(400).json({ message: "Student doesn't exist" });
        }
        //check if user have record in admission
        const hasStudentRecordInPatientAdmission = yield (0, PatientAdmission_1.getPatientAdmissionByStudentId)(student_id); // Await the promise to get the result
        if (!hasStudentRecordInPatientAdmission) {
            return res.status(400).json({ message: "Student doesn't have any record" });
        }
        const datenow = new Date();
        const docTypes = {
            "physical-exam": "Physical Exam",
            "medical-certificate": "Medical Certificate",
            "clinic-note": "Clinical Note",
            "referral-form": "Referral Form",
        };
        const matchingKey = (_a = Object.entries(docTypes).find(([, value]) => value === document_type)) === null || _a === void 0 ? void 0 : _a[0];
        if (!matchingKey) {
            return res.status(400).json({ message: "Invalid document type" });
        }
        let outputDirectory = "";
        let outputFilePath = "";
        if (matchingKey === "medical-certificate") {
            const medicalCertificateRecord = yield (0, Documents_1.getMedicalCertificateRecord)(student_id);
            const doctorRecord = yield (0, Documents_1.getMedicalDoctor)(doctor_id);
            const medicalCertificatePayload = {
                student_id: (medicalCertificateRecord === null || medicalCertificateRecord === void 0 ? void 0 : medicalCertificateRecord.student_id) || student_id,
                document_type: matchingKey,
                name: `${medicalCertificateRecord === null || medicalCertificateRecord === void 0 ? void 0 : medicalCertificateRecord.first_name} ${medicalCertificateRecord === null || medicalCertificateRecord === void 0 ? void 0 : medicalCertificateRecord.last_name}`,
                address: (medicalCertificateRecord === null || medicalCertificateRecord === void 0 ? void 0 : medicalCertificateRecord.address) || "N/A",
                date: datenow.toLocaleDateString(),
                age: (medicalCertificateRecord === null || medicalCertificateRecord === void 0 ? void 0 : medicalCertificateRecord.date_of_birth)
                    ? (0, commonService_1.calculateAge)(medicalCertificateRecord.date_of_birth)
                    : "N/A",
                sex: (medicalCertificateRecord === null || medicalCertificateRecord === void 0 ? void 0 : medicalCertificateRecord.sex) || "N/A",
                comment: (medicalCertificateRecord === null || medicalCertificateRecord === void 0 ? void 0 : medicalCertificateRecord.chief_complaint) || "N/A",
                status: (medicalCertificateRecord === null || medicalCertificateRecord === void 0 ? void 0 : medicalCertificateRecord.medcert_data) || "N/A",
                remarks: (medicalCertificateRecord === null || medicalCertificateRecord === void 0 ? void 0 : medicalCertificateRecord.medcert_remarks) || "N/A",
                // ****** doctor ******
                doctor_fullname: (doctorRecord === null || doctorRecord === void 0 ? void 0 : doctorRecord.fullname) || "N/A",
                doctor_signature: (doctorRecord === null || doctorRecord === void 0 ? void 0 : doctorRecord.signature) || "N/A",
                doctor_prc_license: (doctorRecord === null || doctorRecord === void 0 ? void 0 : doctorRecord.prc_license) || "N/A",
            };
            outputDirectory = path_1.default.join(__dirname, `../../public/generatedPdf`);
            outputFilePath = path_1.default.join(outputDirectory, `generated_${medicalCertificatePayload.student_id}.pdf`);
            if (!fs_1.default.existsSync(outputDirectory)) {
                return res.status(500).json({ message: "Output directory does not exist" });
            }
            yield (0, pdfService_1.buildPDFDocsForMedicalCertificate)(medicalCertificatePayload, outputFilePath);
        }
        else if (matchingKey === "clinic-note") {
            const clinicNoteRecord = yield (0, Documents_1.getMedicalCertificateRecord)(student_id);
            const doctorRecord = yield (0, Documents_1.getMedicalDoctor)(doctor_id);
            const clinicNotePayload = {
                student_id: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.student_id) || student_id,
                document_type: matchingKey,
                pe_no: (0, commonService_1.generateUniquePeNo)(),
                date: datenow.toLocaleDateString(),
                name: `${clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.first_name} ${clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.last_name}`,
                age: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.date_of_birth) ? (0, commonService_1.calculateAge)(clinicNoteRecord.date_of_birth) : "N/A",
                sex: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.sex) || "N/A",
                address: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.address) || "N/A",
                department: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.department) || "N/A",
                section: "Block 1",
                contact_number: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.contact) || "N/A",
                phinma_email: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.email) || "N/A",
                chief_complaint: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.chief_complaint) || "N/A",
                working_dx: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.working_diagnosis) || "N/A",
                blood_pressure: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.blood_pressure) || "N/A",
                pulse_rate: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.pulse_rate) || "N/A",
                respiratory: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.respiratory_rate) || "N/A",
                temperature: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.temperature) || "N/A",
                spO2: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.oxygen_saturation) || "N/A",
                signs_and_symptoms: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.signs_and_symptoms) || "N/A",
                allergies: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.allergies) || "N/A",
                medications: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.prescription) || "N/A",
                past_medical_history: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.past_medical_history) || "N/A",
                last_oral_intake: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.medication) || "N/A",
                event_loading_to_injury: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.assessment) || "N/A",
                management: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.nurse_notes) || "N/A",
                remarks: (clinicNoteRecord === null || clinicNoteRecord === void 0 ? void 0 : clinicNoteRecord.actions) || "N/A",
                // ****** doctor ******
                doctor_fullname: (doctorRecord === null || doctorRecord === void 0 ? void 0 : doctorRecord.fullname) || "N/A",
                doctor_signature: (doctorRecord === null || doctorRecord === void 0 ? void 0 : doctorRecord.signature) || "N/A",
                doctor_prc_license: (doctorRecord === null || doctorRecord === void 0 ? void 0 : doctorRecord.prc_license) || "N/A",
            };
            outputDirectory = path_1.default.join(__dirname, `../../public/generatedPdf`);
            outputFilePath = path_1.default.join(outputDirectory, `generated_${clinicNotePayload.student_id}.pdf`);
            if (!fs_1.default.existsSync(outputDirectory)) {
                return res.status(500).json({ message: "Output directory does not exist" });
            }
            yield (0, pdfService_1.buildPDFDocsForClinicNote)(clinicNotePayload, outputFilePath);
        }
        else if (matchingKey === "referral-form") {
            const referralRecord = yield (0, Documents_1.getMedicalCertificateRecord)(student_id);
            const doctorRecord = yield (0, Documents_1.getMedicalDoctor)(doctor_id);
            const referralFormPayload = {
                student_id: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.student_id) || student_id,
                document_type: matchingKey,
                pe_no: (0, commonService_1.generateUniquePeNo)(),
                date: datenow.toLocaleDateString(),
                name: `${referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.first_name} ${referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.last_name}`,
                age: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.date_of_birth) ? (0, commonService_1.calculateAge)(referralRecord.date_of_birth) : "N/A",
                sex: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.sex) || "N/A",
                address: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.address) || "N/A",
                department: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.department) || "N/A",
                section: "Block 1",
                contact_number: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.contact) || "N/A",
                phinma_email: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.email) || "N/A",
                chief_complaint: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.chief_complaint) || "N/A",
                working_dx: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.working_diagnosis) || "N/A",
                blood_pressure: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.blood_pressure) || "N/A",
                pulse_rate: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.pulse_rate) || "N/A",
                respiratory: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.respiratory_rate) || "N/A",
                temperature: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.temperature) || "N/A",
                spO2: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.oxygen_saturation) || "N/A",
                signs_and_symptoms: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.signs_and_symptoms) || "N/A",
                allergies: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.allergies) || "N/A",
                medications: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.prescription) || "N/A",
                past_medical_history: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.past_medical_history) || "N/A",
                last_oral_intake: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.medication) || "N/A",
                event_loading_to_injury: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.assessment) || "N/A",
                management: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.nurse_notes) || "N/A",
                remarks: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.actions) || "N/A",
                reason_for_consultation: (referralRecord === null || referralRecord === void 0 ? void 0 : referralRecord.reason_for_consultation) || "N/A",
                // ****** doctor ******
                doctor_fullname: (doctorRecord === null || doctorRecord === void 0 ? void 0 : doctorRecord.fullname) || "N/A",
                doctor_signature: (doctorRecord === null || doctorRecord === void 0 ? void 0 : doctorRecord.signature) || "N/A",
                doctor_prc_license: (doctorRecord === null || doctorRecord === void 0 ? void 0 : doctorRecord.prc_license) || "N/A",
            };
            outputDirectory = path_1.default.join(__dirname, `../../public/generatedPdf`);
            outputFilePath = path_1.default.join(outputDirectory, `generated_${referralFormPayload.student_id}.pdf`);
            if (!fs_1.default.existsSync(outputDirectory)) {
                return res.status(500).json({ message: "Output directory does not exist" });
            }
            yield (0, pdfService_1.buildPDFDocsForReferralForm)(referralFormPayload, outputFilePath);
        }
        else if (matchingKey === "physical-exam") {
            const physicalExamReportRecord = yield (0, Documents_1.getMedicalCertificateRecord)(student_id);
            const doctorRecord = yield (0, Documents_1.getMedicalDoctor)(doctor_id);
            const physicalExamReportPayload = {
                student_id: (physicalExamReportRecord === null || physicalExamReportRecord === void 0 ? void 0 : physicalExamReportRecord.student_id) || student_id,
                document_type: matchingKey,
                pe_no: (0, commonService_1.generateUniquePeNo)(),
                date: datenow.toLocaleDateString(),
                name: `${physicalExamReportRecord === null || physicalExamReportRecord === void 0 ? void 0 : physicalExamReportRecord.first_name} ${physicalExamReportRecord === null || physicalExamReportRecord === void 0 ? void 0 : physicalExamReportRecord.last_name}`,
                age: (physicalExamReportRecord === null || physicalExamReportRecord === void 0 ? void 0 : physicalExamReportRecord.date_of_birth)
                    ? (0, commonService_1.calculateAge)(physicalExamReportRecord.date_of_birth)
                    : "N/A",
                sex: (physicalExamReportRecord === null || physicalExamReportRecord === void 0 ? void 0 : physicalExamReportRecord.sex) || "N/A",
                address: (physicalExamReportRecord === null || physicalExamReportRecord === void 0 ? void 0 : physicalExamReportRecord.address) || "N/A",
                department: (physicalExamReportRecord === null || physicalExamReportRecord === void 0 ? void 0 : physicalExamReportRecord.department) || "N/A",
                section: "Block 1",
                contact_number: (physicalExamReportRecord === null || physicalExamReportRecord === void 0 ? void 0 : physicalExamReportRecord.contact) || "N/A",
                phinma_email: (physicalExamReportRecord === null || physicalExamReportRecord === void 0 ? void 0 : physicalExamReportRecord.email) || "N/A",
                blood_pressure: (physicalExamReportRecord === null || physicalExamReportRecord === void 0 ? void 0 : physicalExamReportRecord.blood_pressure) || "N/A",
                pulse_rate: (physicalExamReportRecord === null || physicalExamReportRecord === void 0 ? void 0 : physicalExamReportRecord.pulse_rate) || "N/A",
                respiratory: (physicalExamReportRecord === null || physicalExamReportRecord === void 0 ? void 0 : physicalExamReportRecord.respiratory_rate) || "N/A",
                temperature: (physicalExamReportRecord === null || physicalExamReportRecord === void 0 ? void 0 : physicalExamReportRecord.temperature) || "N/A",
                spO2: (physicalExamReportRecord === null || physicalExamReportRecord === void 0 ? void 0 : physicalExamReportRecord.oxygen_saturation) || "N/A",
                remarks: (physicalExamReportRecord === null || physicalExamReportRecord === void 0 ? void 0 : physicalExamReportRecord.remarks) || "N/A",
                // ****** doctor ******
                doctor_fullname: (doctorRecord === null || doctorRecord === void 0 ? void 0 : doctorRecord.fullname) || "N/A",
                doctor_signature: (doctorRecord === null || doctorRecord === void 0 ? void 0 : doctorRecord.signature) || "N/A",
                doctor_prc_license: (doctorRecord === null || doctorRecord === void 0 ? void 0 : doctorRecord.prc_license) || "N/A",
            };
            outputDirectory = path_1.default.join(__dirname, `../../public/generatedPdf`);
            outputFilePath = path_1.default.join(outputDirectory, `generated_${physicalExamReportPayload.student_id}.pdf`);
            if (!fs_1.default.existsSync(outputDirectory)) {
                return res.status(500).json({ message: "Output directory does not exist" });
            }
            yield (0, pdfService_1.buildPDFDocsForPhysicalExamForm)(physicalExamReportPayload, outputFilePath);
        }
        // Send the PDF file back in the response
        if (outputFilePath === "") {
            res.status(400).json({ message: "file path error", error: "error" });
        }
        else {
            res.download(outputFilePath, `generated_${matchingKey}.pdf`, (err) => {
                if (err) {
                    console.error("Error sending PDF:", err);
                    res.status(500).send("Error sending PDF file");
                }
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Error generating PDF", error: error.message });
        }
        return res.status(500).json({ message: "An unexpected error occurred" });
    }
});
exports.printDocs = printDocs;
