import pool from "../config/database";
import { Patient } from "./Patient";

export interface PatientAdmission {
  student_id: string;
  cases: string;
  vitalSigns: string;
  actions: string;
  common_reasons: string;
  reasons?: string;
  prescription: string;
  nurseNotes: string;
  emasOnDuty: string;
  timestamp: string;
}

export interface PatientConsultationTypes {
  // profile_photo: string;
  emasOnDuty: string;
  timestamp: string;
  student_id: string;
  // first_name: string;
  // last_name: string;
  // sex: "male" | "female"; // Enum for better type safety
  // contact: string;
  // email: string;
  // address: string;
  // date_of_birth: string; // Alternatively, use Date if working with Date objects
  // department: string;
  nurseNotes: string;
  temperature: string; // Can be a number if consistent format is ensured
  pulse_rate: string; // Can be a number if consistent format is ensured
  respiratory_rate: string; // Can be a number if consistent format is ensured
  blood_pressure: string; // Should be a string to account for formats like "120/80"
  oxygen_saturation: string; // Can be a number if consistent format is ensured
  pain_scale: string; // Can be a number if consistent format is ensured
  services?: string[]; // Array of service types
  chief_complaint?: string;
  working_diagnosis?: string;
  signs_and_symptoms?: string;
  allergies?: string;
  case_type?: string; // Flexible type to allow for both string and number
  medication?: string;
  quantity?: string;
  past_medical_history?: string;
  assessment?: string;
  remarks?: string;
  reason_for_consultation?: string;

  status?: string;
  physical_exam_remarks?: string;

  vaccination_given?: string;
  dose_no?: string;
  purpose?: string;

  medcert_data?: string;
  medcert_remarks?: string;
}

export interface MergedPatient extends Patient, PatientAdmission {
  // This interface will inherit all fields from both Patient and PatientAdmission
}

export const addNewConsultationMedical = async (patientConsultation: PatientConsultationTypes): Promise<void> => {
  try {
    const [admissionResult] = await pool.query(
      `INSERT INTO patient_admission 
      (student_id, nurse_notes, emas_on_duty, timestamp, temperature, pulse_rate, respiratory_rate, blood_pressure, oxygen_saturation, pain_scale, services) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
      ]
    );

    // Get the auto-generated patient_admission_id
    const patientAdmissionId = (admissionResult as any).insertId;

    // Use the admission ID for the medical_service insert
    await pool.query(
      `INSERT INTO medical_service
      (chief_complaint, working_diagnosis, signs_and_symptoms, allergies, case_type, medication,quantity,past_medical_history,assessment,remarks,reason_for_consultation,patient_admission_id, datetime)
      VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)`,
      [
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
      ]
    );
  } catch (error) {
    throw error;
  }
};

export const addNewConsultationPhysicalExam = async (patientConsultation: PatientConsultationTypes): Promise<void> => {
  try {
    const [admissionResult] = await pool.query(
      `INSERT INTO patient_admission 
      (student_id, nurse_notes, emas_on_duty, timestamp, temperature, pulse_rate, respiratory_rate, blood_pressure, oxygen_saturation, pain_scale, services) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
      ]
    );

    // Get the auto-generated patient_admission_id
    const patientAdmissionId = (admissionResult as any).insertId;

    // Use the admission ID for the medical_service insert
    await pool.query(
      `INSERT INTO physical_examination
                (status, remarks, patient_admission_id, datetime)
                VALUES (?, ?, ?, ?)`,
      [
        patientConsultation.status,
        patientConsultation.physical_exam_remarks,
        patientAdmissionId,
        patientConsultation.timestamp,
      ]
    );
  } catch (error) {
    throw error;
  }
};

export const addNewConsultationVaccination = async (patientConsultation: PatientConsultationTypes): Promise<void> => {
  try {
    const [admissionResult] = await pool.query(
      `INSERT INTO patient_admission 
      (student_id, nurse_notes, emas_on_duty, timestamp, temperature, pulse_rate, respiratory_rate, blood_pressure, oxygen_saturation, pain_scale, services) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
      ]
    );

    // Get the auto-generated patient_admission_id
    const patientAdmissionId = (admissionResult as any).insertId;
    await pool.query(
      `INSERT INTO vaccination_service
            (vaccination_given, dose_no, purpose, patient_admission_id, datetime)
            VALUES (?, ?, ?, ?, ?)`,
      [
        patientConsultation.vaccination_given,
        patientConsultation.dose_no,
        patientConsultation.purpose,
        patientAdmissionId,
        patientConsultation.timestamp,
      ]
    );
  } catch (error) {
    throw error;
  }
};

export const addNewConsultationMedcert = async (patientConsultation: PatientConsultationTypes): Promise<void> => {
  try {
    const [admissionResult] = await pool.query(
      `INSERT INTO patient_admission 
      (student_id, nurse_notes, emas_on_duty, timestamp, temperature, pulse_rate, respiratory_rate, blood_pressure, oxygen_saturation, pain_scale, services) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
      ]
    );

    // Get the auto-generated patient_admission_id
    const patientAdmissionId = (admissionResult as any).insertId;

    await pool.query(
      `INSERT INTO med_cert
            (medcert_data, medcert_remarks, patient_admission_id, datetime)
            VALUES (?, ?, ?, ?)`,
      [
        patientConsultation.medcert_data,
        patientConsultation.medcert_remarks,
        patientAdmissionId,
        patientConsultation.timestamp,
      ]
    );
  } catch (error) {
    throw error;
  }
};

export const addNewPatientAdmission = async (patientAdmission: PatientAdmission): Promise<void> => {
  try {
    await pool.query(
      "INSERT INTO patient_admission (student_id, cases, vital_signs, actions, common_reasons, reasons, prescription, nurse_notes, emas_on_duty, timestamp) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [
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
      ]
    );
  } catch (error) {
    throw error;
  }
};

export const updatePatientAdmission = async (id: string, updatedData: PatientAdmission): Promise<void> => {
  try {
    await pool.query(
      `UPDATE patient_admission 
         SET cases = ?, 
             vital_signs = ?, 
             actions = ?, 
             common_reasons = ?,
             reasons = ?, 
             prescription = ?, 
             nurse_notes = ?, 
             emas_on_duty = ?, 
             timestamp = ?
         WHERE id = ?`,
      [
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
      ]
    );
  } catch (error) {
    throw error; // Re-throw the error for further handling
  }
};

export const newUpdatePatientAdmission = async (id: string, updatedData: PatientConsultationTypes): Promise<void> => {
  try {
    await pool.query(
      `UPDATE patient_admission 
         SET temperature = ?, 
             pulse_rate = ?, 
             respiratory_rate = ?,
             blood_pressure = ?, 
             oxygen_saturation = ?, 
             pain_scale = ?, 
             nurse_notes = ?, 
             emas_on_duty = ?, 
             timestamp = ?
         WHERE id = ?`,
      [
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
      ]
    );
  } catch (error) {
    throw error; // Re-throw the error for further handling
  }
};

export const getAllPatientAdmissions = async (): Promise<MergedPatient[]> => {
  try {
    const [rows]: any = await pool.query(
      "SELECT p.*, d.name AS department_name,pa.* FROM patient p INNER JOIN department d ON p.department = d.id INNER JOIN patient_admission pa ON p.student_id = pa.student_id ORDER BY pa.timestamp DESC"
    );
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

    return rows as MergedPatient[];
  } catch (error) {
    // Log the error for better debugging
    console.error("Error fetching patients from the database:", error);
    throw new Error("Database query failed"); // Re-throw a generic error for security
  }
};

export const getPatientAdmissionById = async (id: string): Promise<MergedPatient[]> => {
  try {
    const result = await pool.query(
      `SELECT p.*, d.name AS department_name, pa.* 
         FROM patient p 
         INNER JOIN department d ON p.department = d.id 
         INNER JOIN patient_admission pa ON p.student_id = pa.student_id 
         WHERE pa.id = ?`,
      [id]
    );

    const rows = result[0]; // result[0] will hold the rows
    return rows as MergedPatient[];
  } catch (error) {
    throw error;
  }
};

export const deletePatientAdmissionById = async (id: string): Promise<void> => {
  try {
    await pool.query(
      `DELETE pa 
         FROM patient_admission pa 
         WHERE pa.id = ?`,
      [id]
    );
  } catch (error) {
    throw error;
  }
};

export const getPatientAdmissionByStudentId = async (student_id: number): Promise<any | null> => {
  const [rows] = await pool.query("SELECT * FROM patient_admission WHERE student_id = ?", [student_id]);
  return (rows as any).length > 0 ? (rows as any)[0] : null; // Return the first row or null if not found
};
