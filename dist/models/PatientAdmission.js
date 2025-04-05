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
exports.getPatientAdmissionByStudentId = exports.deletePatientAdmissionById = exports.getPatientAdmissionById = exports.getAllPatientAdmissions = exports.newUpdatePatientAdmission = exports.updatePatientAdmission = exports.addNewPatientAdmission = exports.addNewConsultationMedcert = exports.addNewConsultationVaccination = exports.addNewConsultationPhysicalExam = exports.addNewConsultationMedical = void 0;
const database_1 = __importDefault(require("../config/database"));
const addNewConsultationMedical = (patientConsultation) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [admissionResult] = yield database_1.default.query(`INSERT INTO patient_admission 
      (student_id, nurse_notes, emas_on_duty, timestamp, temperature, pulse_rate, respiratory_rate, blood_pressure, oxygen_saturation, pain_scale, services) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            patientConsultation.student_id,
            patientConsultation.nurseNotes,
            patientConsultation.emasOnDuty,
            patientConsultation.timestamp,
            patientConsultation.temperature,
            patientConsultation.pulse_rate,
            patientConsultation.respiratory_rate,
            patientConsultation.blood_pressure,
            patientConsultation.oxygen_saturation,
            patientConsultation.pain_scale,
            "health_concern",
        ]);
        // Get the auto-generated patient_admission_id
        const patientAdmissionId = admissionResult.insertId;
        // Use the admission ID for the medical_service insert
        yield database_1.default.query(`INSERT INTO medical_service
      (chief_complaint, working_diagnosis, signs_and_symptoms, allergies, case_type, medication,quantity,past_medical_history,assessment,remarks,reason_for_consultation,patient_admission_id, datetime)
      VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)`, [
            patientConsultation.chief_complaint,
            patientConsultation.working_diagnosis,
            patientConsultation.signs_and_symptoms,
            patientConsultation.allergies,
            patientConsultation.case_type,
            patientConsultation.medication,
            patientConsultation.quantity,
            patientConsultation.past_medical_history,
            patientConsultation.assessment,
            patientConsultation.remarks,
            patientConsultation.reason_for_consultation,
            patientAdmissionId,
            patientConsultation.timestamp,
        ]);
    }
    catch (error) {
        throw error;
    }
});
exports.addNewConsultationMedical = addNewConsultationMedical;
const addNewConsultationPhysicalExam = (patientConsultation) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [admissionResult] = yield database_1.default.query(`INSERT INTO patient_admission 
      (student_id, nurse_notes, emas_on_duty, timestamp, temperature, pulse_rate, respiratory_rate, blood_pressure, oxygen_saturation, pain_scale, services) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            patientConsultation.student_id,
            patientConsultation.nurseNotes,
            patientConsultation.emasOnDuty,
            patientConsultation.timestamp,
            patientConsultation.temperature,
            patientConsultation.pulse_rate,
            patientConsultation.respiratory_rate,
            patientConsultation.blood_pressure,
            patientConsultation.oxygen_saturation,
            patientConsultation.pain_scale,
            "physical_exam",
        ]);
        // Get the auto-generated patient_admission_id
        const patientAdmissionId = admissionResult.insertId;
        // Use the admission ID for the medical_service insert
        yield database_1.default.query(`INSERT INTO physical_examination
                (status, remarks, patient_admission_id, datetime)
                VALUES (?, ?, ?, ?)`, [
            patientConsultation.status,
            patientConsultation.physical_exam_remarks,
            patientAdmissionId,
            patientConsultation.timestamp,
        ]);
    }
    catch (error) {
        throw error;
    }
});
exports.addNewConsultationPhysicalExam = addNewConsultationPhysicalExam;
const addNewConsultationVaccination = (patientConsultation) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [admissionResult] = yield database_1.default.query(`INSERT INTO patient_admission 
      (student_id, nurse_notes, emas_on_duty, timestamp, temperature, pulse_rate, respiratory_rate, blood_pressure, oxygen_saturation, pain_scale, services) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            patientConsultation.student_id,
            patientConsultation.nurseNotes,
            patientConsultation.emasOnDuty,
            patientConsultation.timestamp,
            patientConsultation.temperature,
            patientConsultation.pulse_rate,
            patientConsultation.respiratory_rate,
            patientConsultation.blood_pressure,
            patientConsultation.oxygen_saturation,
            patientConsultation.pain_scale,
            "vaccination",
        ]);
        // Get the auto-generated patient_admission_id
        const patientAdmissionId = admissionResult.insertId;
        yield database_1.default.query(`INSERT INTO vaccination_service
            (vaccination_given, dose_no, purpose, patient_admission_id, datetime)
            VALUES (?, ?, ?, ?, ?)`, [
            patientConsultation.vaccination_given,
            patientConsultation.dose_no,
            patientConsultation.purpose,
            patientAdmissionId,
            patientConsultation.timestamp,
        ]);
    }
    catch (error) {
        throw error;
    }
});
exports.addNewConsultationVaccination = addNewConsultationVaccination;
const addNewConsultationMedcert = (patientConsultation) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [admissionResult] = yield database_1.default.query(`INSERT INTO patient_admission 
      (student_id, nurse_notes, emas_on_duty, timestamp, temperature, pulse_rate, respiratory_rate, blood_pressure, oxygen_saturation, pain_scale, services) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            patientConsultation.student_id,
            patientConsultation.nurseNotes,
            patientConsultation.emasOnDuty,
            patientConsultation.timestamp,
            patientConsultation.temperature,
            patientConsultation.pulse_rate,
            patientConsultation.respiratory_rate,
            patientConsultation.blood_pressure,
            patientConsultation.oxygen_saturation,
            patientConsultation.pain_scale,
            "med_certificate",
        ]);
        // Get the auto-generated patient_admission_id
        const patientAdmissionId = admissionResult.insertId;
        yield database_1.default.query(`INSERT INTO med_cert
            (medcert_data, medcert_remarks, patient_admission_id, datetime)
            VALUES (?, ?, ?, ?)`, [
            patientConsultation.medcert_data,
            patientConsultation.medcert_remarks,
            patientAdmissionId,
            patientConsultation.timestamp,
        ]);
    }
    catch (error) {
        throw error;
    }
});
exports.addNewConsultationMedcert = addNewConsultationMedcert;
const addNewPatientAdmission = (patientAdmission) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.query("INSERT INTO patient_admission (student_id, cases, vital_signs, actions, common_reasons, reasons, prescription, nurse_notes, emas_on_duty, timestamp) VALUES (?,?,?,?,?,?,?,?,?,?)", [
            patientAdmission.student_id,
            patientAdmission.cases,
            patientAdmission.vitalSigns,
            patientAdmission.actions,
            patientAdmission.common_reasons,
            patientAdmission.reasons,
            patientAdmission.prescription,
            patientAdmission.nurseNotes,
            patientAdmission.emasOnDuty,
            patientAdmission.timestamp,
        ]);
    }
    catch (error) {
        throw error;
    }
});
exports.addNewPatientAdmission = addNewPatientAdmission;
const updatePatientAdmission = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.query(`UPDATE patient_admission 
         SET cases = ?, 
             vital_signs = ?, 
             actions = ?, 
             common_reasons = ?,
             reasons = ?, 
             prescription = ?, 
             nurse_notes = ?, 
             emas_on_duty = ?, 
             timestamp = ?
         WHERE id = ?`, [
            updatedData.cases,
            updatedData.vitalSigns,
            updatedData.actions,
            updatedData.common_reasons,
            updatedData.reasons,
            updatedData.prescription,
            updatedData.nurseNotes,
            updatedData.emasOnDuty,
            updatedData.timestamp,
            id,
        ]);
    }
    catch (error) {
        throw error; // Re-throw the error for further handling
    }
});
exports.updatePatientAdmission = updatePatientAdmission;
const newUpdatePatientAdmission = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.query(`UPDATE patient_admission 
         SET temperature = ?, 
             pulse_rate = ?, 
             respiratory_rate = ?,
             blood_pressure = ?, 
             oxygen_saturation = ?, 
             pain_scale = ?, 
             nurse_notes = ?, 
             emas_on_duty = ?, 
             timestamp = ?
         WHERE id = ?`, [
            updatedData.temperature,
            updatedData.pulse_rate,
            updatedData.respiratory_rate,
            updatedData.blood_pressure,
            updatedData.oxygen_saturation,
            updatedData.pain_scale,
            updatedData.nurseNotes,
            updatedData.emasOnDuty,
            updatedData.timestamp,
            id,
        ]);
    }
    catch (error) {
        throw error; // Re-throw the error for further handling
    }
});
exports.newUpdatePatientAdmission = newUpdatePatientAdmission;
const getAllPatientAdmissions = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.default.query("SELECT p.*, d.name AS department_name,pa.* FROM patient p INNER JOIN department d ON p.department = d.id INNER JOIN patient_admission pa ON p.student_id = pa.student_id ORDER BY pa.timestamp DESC");
        // const [rows]: any = await pool.query(
        //   `SELECT
        //     p.id,
        //     p.first_name,
        //     p.last_name,
        //     p.email,
        //     p.student_id,
        //     p.sex,
        //     p.address,
        //     p.date_of_birth,
        //     p.contact,
        //     p.department,
        //     p.profile_photo,
        //     d.name AS department_name,
        //     IF(
        //       COUNT(pa.student_id) = 0,
        //       JSON_ARRAY(),
        //       JSON_ARRAYAGG(
        //         JSON_OBJECT(
        //           'student_id', COALESCE(pa.student_id, ''),
        //           'cases', COALESCE(pa.cases, ''),
        //           'vital_signs', COALESCE(pa.vital_signs, ''),
        //           'actions', COALESCE(pa.actions, ''),
        //           'reasons', COALESCE(pa.reasons, ''),
        //           'prescription', COALESCE(pa.prescription, ''),
        //           'nurse_notes', COALESCE(pa.nurse_notes, ''),
        //           'emas_on_duty', COALESCE(pa.emas_on_duty, ''),
        //           'timestamp', COALESCE(pa.timestamp, '')
        //         )
        //       )
        //     ) AS admissions
        //   FROM
        //     patient p
        //   INNER JOIN
        //     department d
        //     ON p.department = d.id
        //   LEFT JOIN
        //     patient_admission pa
        //     ON p.student_id = pa.student_id
        //   GROUP BY
        //     p.id, p.first_name, p.last_name, p.email, p.student_id, p.sex, p.address, p.date_of_birth, p.contact, p.department, p.profile_photo, d.name
        //   ORDER BY
        //     p.id DESC`
        // );
        if (!Array.isArray(rows)) {
            throw new Error("Query did not return a result set.");
        }
        // Log the number of patients fetched
        console.log(`Fetched ${rows.length} patients from the database.`);
        return rows;
    }
    catch (error) {
        // Log the error for better debugging
        console.error("Error fetching patients from the database:", error);
        throw new Error("Database query failed"); // Re-throw a generic error for security
    }
});
exports.getAllPatientAdmissions = getAllPatientAdmissions;
const getPatientAdmissionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.default.query(`SELECT p.*, d.name AS department_name, pa.* 
         FROM patient p 
         INNER JOIN department d ON p.department = d.id 
         INNER JOIN patient_admission pa ON p.student_id = pa.student_id 
         WHERE pa.id = ?`, [id]);
        const rows = result[0]; // result[0] will hold the rows
        return rows;
    }
    catch (error) {
        throw error;
    }
});
exports.getPatientAdmissionById = getPatientAdmissionById;
const deletePatientAdmissionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.query(`DELETE pa 
         FROM patient_admission pa 
         WHERE pa.id = ?`, [id]);
    }
    catch (error) {
        throw error;
    }
});
exports.deletePatientAdmissionById = deletePatientAdmissionById;
const getPatientAdmissionByStudentId = (student_id) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield database_1.default.query("SELECT * FROM patient_admission WHERE student_id = ?", [student_id]);
    return rows.length > 0 ? rows[0] : null; // Return the first row or null if not found
});
exports.getPatientAdmissionByStudentId = getPatientAdmissionByStudentId;
