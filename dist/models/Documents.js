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
exports.getMedicalDoctor = exports.getMedicalCertificateRecord = void 0;
const database_1 = __importDefault(require("../config/database"));
// Ensure the query returns RowDataPacket[]
const getMedicalCertificateRecord = (student_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.default.query(// Use RowDataPacket[]
        `SELECT p.*, pa.*, ms.*, pe.*, vs.*, mc.*, d.name as department
            FROM patient p
            INNER JOIN patient_admission pa ON p.student_id = pa.student_id
            INNER JOIN department as d ON p.department = d.id
            LEFT JOIN medical_service as ms ON pa.id = ms.patient_admission_id
            LEFT JOIN physical_examination as pe ON pa.id = pe.patient_admission_id
            LEFT JOIN vaccination_service as vs ON pa.id = vs.patient_admission_id
            LEFT JOIN med_cert as mc ON pa.id = mc.patient_admission_id

            WHERE p.student_id = ?
            ORDER BY pa.timestamp DESC
            LIMIT 1`, [student_id]);
        // If there are rows, return the first row as MedicalCertificateTypes
        if (rows.length > 0) {
            return rows[0]; // Cast to MedicalCertificateTypes
        }
        else {
            return null; // No records found
        }
    }
    catch (error) {
        throw error; // You can add more specific error handling if needed
    }
});
exports.getMedicalCertificateRecord = getMedicalCertificateRecord;
const getMedicalDoctor = (doctor_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.default.query(// Use RowDataPacket[]
        `SELECT * FROM doctors WHERE id = ?`, [doctor_id]);
        // If there are rows, return the first row as MedicalCertificateTypes
        if (rows.length > 0) {
            return rows[0]; // Cast to MedicalCertificateTypes
        }
        else {
            return null; // No records found
        }
    }
    catch (error) {
        throw error; // You can add more specific error handling if needed
    }
});
exports.getMedicalDoctor = getMedicalDoctor;
