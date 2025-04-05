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
exports.getStudentRecords = exports.getPatientClinicVisitLogModel = exports.getPatientById = exports.getAllPatients = exports.deletePatientByID = exports.updatePatient = exports.addBulkPatients = exports.addNewPatient = exports.checkstudentExistsBulk = exports.studentExists = void 0;
const database_1 = __importDefault(require("../config/database"));
const Common_1 = require("./Common");
// check if an studentID already exists
const studentExists = (student_id) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield database_1.default.query("SELECT 1 FROM patient WHERE student_id = ?", [student_id]);
    return rows.length > 0;
});
exports.studentExists = studentExists;
const checkstudentExistsBulk = (studentIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.default.query("SELECT student_id FROM patient WHERE student_id IN (?)", [studentIds]);
        // If rows is an array of objects, map to get the student_ids
        const existingStudentIds = rows.map((row) => row.student_id);
        return existingStudentIds;
    }
    catch (error) {
        throw new Error("Error checking student existence");
    }
});
exports.checkstudentExistsBulk = checkstudentExistsBulk;
const addNewPatient = (patient) => __awaiter(void 0, void 0, void 0, function* () {
    const datenow = new Date();
    try {
        yield database_1.default.query(`INSERT INTO patient 
      (first_name, last_name, email, student_id, sex, address, date_of_birth, contact, department, height, weight, bmi, bmi_category, existing_medical_condition, maintenance_medication, allergies, vaccination_link, family_hx_of_illness, smoking, drinking, health_insurance, patient_category, blood_type, profile_photo,date_added) 
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
            patient.first_name,
            patient.last_name,
            patient.email,
            patient.student_id,
            patient.sex,
            patient.address,
            patient.date_of_birth,
            patient.contact,
            patient.department,
            patient.height,
            patient.weight,
            patient.bmi,
            patient.bmi_category,
            patient.existing_medical_condition,
            patient.maintenance_medication,
            patient.allergies,
            patient.vaccination_link,
            patient.family_hx_of_illness,
            patient.smoking,
            patient.drinking,
            patient.health_insurance,
            patient.patient_category,
            patient.blood_type,
            patient.profile_photo,
            datenow,
        ]);
    }
    catch (error) {
        throw error;
    }
});
exports.addNewPatient = addNewPatient;
// export const addBulkPatients = async (patients: Patient[]): Promise<number> => {
//   const datenow = new Date();
//   const values = patients.map((patient) => [
//     patient.first_name,
//     patient.last_name,
//     patient.email,
//     patient.student_id,
//     patient.sex,
//     patient.address,
//     patient.date_of_birth,
//     patient.contact,
//     patient.department,
//     patient.height,
//     patient.weight,
//     patient.bmi,
//     patient.bmi_category,
//     patient.existing_medical_condition,
//     patient.maintenance_medication,
//     patient.allergies,
//     patient.vaccination_link,
//     patient.family_hx_of_illness,
//     patient.smoking,
//     patient.drinking,
//     patient.health_insurance,
//     patient.patient_category,
//     patient.blood_type,
//     patient.profile_photo,
//     datenow,
//   ]);
//   try {
//     const [result] = await pool.query<ResultSetHeader>(
//       `INSERT INTO patient
//         (first_name, last_name, email, student_id, sex, address, date_of_birth, contact, department, height, weight, bmi, bmi_category, existing_medical_condition, maintenance_medication, allergies, vaccination_link, family_hx_of_illness, smoking, drinking, health_insurance, patient_category, blood_type, profile_photo, date_added)
//         VALUES ?`,
//       [values]
//     );
//     console.log("Bulk insert successful");
//     return result.affectedRows; // Return the number of rows added
//   } catch (error) {
//     console.error("Error during bulk insert:", error);
//     throw error;
//   }
// };
// export const checkIfDepartmentExistAlready = async (name : string): Promise<any> => {
// }
// export const addBulkPatients = async (patients: Patient[]): Promise<number> => {
//   const datenow = new Date();
//   const values = patients.map((patient) => [
//     patient.first_name,
//     patient.last_name,
//     patient.student_id,
//     patient.sex,
//     patient.contact,
//     patient.email,
//     patient.date_of_birth,
//     patient.profile_photo,
//     datenow,
//   ]);
//   try {
//     const [result] = await pool.query<ResultSetHeader>(
//       `INSERT INTO patient
//         (
//       first_name,
//       last_name,
//       student_id,
//       sex,
//       contact,
//       email,
//       date_of_birth,
//       profile_photo,
//       date_added)
//         VALUES ?`,
//       [values]
//     );
//     console.log("Bulk insert successful");
//     return result.affectedRows; // Return the number of rows added
//   } catch (error) {
//     console.error("Error during bulk insert:", error);
//     throw error;
//   }
// };
const addBulkPatients = (patients) => __awaiter(void 0, void 0, void 0, function* () {
    const datenow = new Date();
    try {
        // Iterate over each patient and ensure department exists
        const values = yield Promise.all(patients.map((patient) => __awaiter(void 0, void 0, void 0, function* () {
            let departmentId = yield (0, Common_1.checkDepartmentIfExistreturnID)(patient.department);
            if (!departmentId) {
                // Ensure patient.department is a string
                departmentId = yield (0, Common_1.createNewDepartmentReturnId)(String(patient.department));
            }
            return [
                patient.first_name,
                patient.last_name,
                patient.student_id,
                patient.sex,
                patient.contact,
                patient.email,
                patient.address,
                patient.date_of_birth,
                departmentId,
                patient.profile_photo,
                datenow,
            ];
        })));
        const [result] = yield database_1.default.query(`INSERT INTO patient 
        (
          first_name, 
          last_name, 
          student_id, 
          sex, 
          contact,
          email,
          address,
          date_of_birth, 
          department,
          profile_photo, 
          date_added
        ) 
        VALUES ?`, [values]);
        console.log("✅ Bulk insert successful");
        return result.affectedRows; // Return the number of rows added
    }
    catch (error) {
        console.error("❌ Error during bulk insert:", error);
        throw error;
    }
});
exports.addBulkPatients = addBulkPatients;
const updatePatient = (patient) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.query(`UPDATE patient 
       SET first_name = ?, last_name = ?, email = ?, student_id = ?, sex = ?, address = ?, date_of_birth = ?, contact = ?, department = ?, height = ?, weight = ?, bmi = ?, bmi_category = ?, existing_medical_condition = ?, maintenance_medication = ?, allergies = ?, vaccination_link = ?, family_hx_of_illness = ?, smoking = ?, drinking = ?, health_insurance = ?, patient_category = ?, blood_type = ?, profile_photo = ? 
       WHERE student_id = ?`, [
            patient.first_name,
            patient.last_name,
            patient.email,
            patient.student_id,
            patient.sex,
            patient.address,
            patient.date_of_birth,
            patient.contact,
            patient.department,
            patient.height,
            patient.weight,
            patient.bmi,
            patient.bmi_category,
            patient.existing_medical_condition,
            patient.maintenance_medication,
            patient.allergies,
            patient.vaccination_link,
            patient.family_hx_of_illness,
            patient.smoking,
            patient.drinking,
            patient.health_insurance,
            patient.patient_category,
            patient.blood_type,
            patient.profile_photo,
            patient.student_id, // Used for identifying the patient in the WHERE clause
        ]);
    }
    catch (error) {
        throw error;
    }
});
exports.updatePatient = updatePatient;
const deletePatientByID = (student_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.query("DELETE FROM patient WHERE student_id = ?", [student_id]);
    }
    catch (error) {
        throw error;
    }
});
exports.deletePatientByID = deletePatientByID;
const getAllPatients = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.default.query("SELECT p.*, d.name AS department_name FROM patient p LEFT JOIN department d ON p.department = d.id ORDER BY p.last_name ASC");
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
exports.getAllPatients = getAllPatients;
const getPatientById = (student_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.default.query(`SELECT p.*, d.name AS department_name FROM patient p 
       LEFT JOIN department d ON p.department = d.id 
       WHERE p.student_id = ?`, [student_id]);
        const rows = result[0]; // result[0] will hold the rows
        return rows;
    }
    catch (error) {
        throw error;
    }
});
exports.getPatientById = getPatientById;
// export const getPatientClinicVisitLogModel = async (student_id: string): Promise<PatientClinicVisitLogType[]> => {
//   try {
//     const result = await pool.query(
//       `SELECT pa.* FROM patient_admission pa
//        WHERE pa.student_id = ?`,
//       [student_id]
//     );
//     const rows = result[0]; // result[0] will hold the rows
//     return rows as PatientClinicVisitLogType[];
//   } catch (error) {
//     throw error;
//   }
// };
const getPatientClinicVisitLogModel = (student_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.default.query(`
      SELECT 
        pa.*,
        ms.chief_complaint, 
        ms.working_diagnosis, 
        ms.signs_and_symptoms, 
        ms.allergies, 
        ms.case_type,
        ms.medication,
        ms.quantity,
        ms.past_medical_history,
        ms.assessment,
        ms.remarks,
        ms.reason_for_consultation,

        ts.status, 
        ts.remarks as physical_exam_remarks, 
        vs.vaccination_given, vs.dose_no, vs.purpose,
        mc.medcert_data,
        mc.medcert_remarks
      FROM patient_admission pa
      LEFT JOIN medical_service ms ON pa.id = ms.patient_admission_id
      LEFT JOIN physical_examination ts ON pa.id = ts.patient_admission_id
      LEFT JOIN vaccination_service vs ON pa.id = vs.patient_admission_id
      LEFT JOIN med_cert mc ON pa.id = mc.patient_admission_id

      WHERE pa.student_id = ?
      ORDER BY pa.timestamp DESC
      `, [student_id]);
        const rows = result[0]; // result[0] will hold the rows
        return rows;
    }
    catch (error) {
        throw error;
    }
});
exports.getPatientClinicVisitLogModel = getPatientClinicVisitLogModel;
const getStudentRecords = (student_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.default.query(`SELECT pa.*, p.first_name, p.last_name, p.email, p.sex, p.address, p.date_of_birth, p.contact, p.department, 
              p.height, p.weight, p.bmi, p.bmi_category, p.existing_medical_condition, p.maintenance_medication, 
              p.allergies, p.vaccination_link, p.family_hx_of_illness, p.smoking, p.drinking, p.health_insurance, 
              p.patient_category, p.blood_type, p.profile_photo
       FROM patient_admission pa
       LEFT JOIN patient p ON pa.student_id = p.student_id
       WHERE pa.student_id = ?`, [student_id]);
        return rows;
    }
    catch (error) {
        console.error("Error fetching student records:", error);
        throw error; // Re-throw the error after logging it
    }
});
exports.getStudentRecords = getStudentRecords;
