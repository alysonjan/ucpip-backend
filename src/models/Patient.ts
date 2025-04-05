import { ResultSetHeader } from "mysql2";
import pool from "../config/database";
import { checkDepartmentIfExistreturnID, createNewDepartmentReturnId } from "./Common";

export interface Patient {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  student_id: string;
  sex: "male" | "female";
  address: string;
  date_of_birth: string;
  contact: string;
  department: string;
  height?: string; // Optional
  weight?: string; // Optional
  bmi?: string; // Optional
  bmi_category?: string; // Optional
  existing_medical_condition?: string; // Optional
  maintenance_medication?: string; // Optional
  allergies?: string; // Optional
  vaccination_link?: string; // Optional
  family_hx_of_illness?: string; // Optional
  smoking?: string; // Optional
  drinking?: string; // Optional
  health_insurance?: string; // Optional
  patient_category?: string; // Optional
  blood_type?: string; // Optional
  profile_photo?: string; // Optional
}

// check if an studentID already exists
export const studentExists = async (student_id: string): Promise<boolean> => {
  const [rows] = await pool.query("SELECT 1 FROM patient WHERE student_id = ?", [student_id]);
  return (rows as any).length > 0;
};

export const checkstudentExistsBulk = async (studentIds: string[]): Promise<string[]> => {
  try {
    const [rows] = await pool.query("SELECT student_id FROM patient WHERE student_id IN (?)", [studentIds]);

    // If rows is an array of objects, map to get the student_ids
    const existingStudentIds = (rows as Array<{ student_id: string }>).map((row) => row.student_id);

    return existingStudentIds;
  } catch (error) {
    throw new Error("Error checking student existence");
  }
};

export const addNewPatient = async (patient: Patient): Promise<void> => {
  const datenow = new Date();
  try {
    await pool.query(
      `INSERT INTO patient 
      (first_name, last_name, email, student_id, sex, address, date_of_birth, contact, department, height, weight, bmi, bmi_category, existing_medical_condition, maintenance_medication, allergies, vaccination_link, family_hx_of_illness, smoking, drinking, health_insurance, patient_category, blood_type, profile_photo,date_added) 
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
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
      ]
    );
  } catch (error) {
    throw error;
  }
};

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

export const addBulkPatients = async (patients: Patient[]): Promise<number> => {
  const datenow = new Date();

  try {
    // Iterate over each patient and ensure department exists
    const values = await Promise.all(
      patients.map(async (patient) => {
        let departmentId = await checkDepartmentIfExistreturnID(patient.department);

        if (!departmentId) {
          // Ensure patient.department is a string
          departmentId = await createNewDepartmentReturnId(String(patient.department));
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
      })
    );

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO patient 
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
        VALUES ?`,
      [values]
    );

    console.log("✅ Bulk insert successful");
    return result.affectedRows; // Return the number of rows added
  } catch (error) {
    console.error("❌ Error during bulk insert:", error);
    throw error;
  }
};

export const updatePatient = async (patient: Patient): Promise<void> => {
  try {
    await pool.query(
      `UPDATE patient 
       SET first_name = ?, last_name = ?, email = ?, student_id = ?, sex = ?, address = ?, date_of_birth = ?, contact = ?, department = ?, height = ?, weight = ?, bmi = ?, bmi_category = ?, existing_medical_condition = ?, maintenance_medication = ?, allergies = ?, vaccination_link = ?, family_hx_of_illness = ?, smoking = ?, drinking = ?, health_insurance = ?, patient_category = ?, blood_type = ?, profile_photo = ? 
       WHERE student_id = ?`,
      [
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
      ]
    );
  } catch (error) {
    throw error;
  }
};

export const deletePatientByID = async (student_id: string): Promise<void> => {
  try {
    await pool.query("DELETE FROM patient WHERE student_id = ?", [student_id]);
  } catch (error) {
    throw error;
  }
};

export const getAllPatients = async (): Promise<Patient[]> => {
  try {
    const [rows]: any = await pool.query(
      "SELECT p.*, d.name AS department_name FROM patient p LEFT JOIN department d ON p.department = d.id ORDER BY p.last_name ASC"
    );

    if (!Array.isArray(rows)) {
      throw new Error("Query did not return a result set.");
    }

    // Log the number of patients fetched
    console.log(`Fetched ${rows.length} patients from the database.`);

    return rows as Patient[];
  } catch (error) {
    // Log the error for better debugging
    console.error("Error fetching patients from the database:", error);
    throw new Error("Database query failed"); // Re-throw a generic error for security
  }
};

export const getPatientById = async (student_id: string): Promise<Patient[]> => {
  try {
    const result = await pool.query(
      `SELECT p.*, d.name AS department_name FROM patient p 
       LEFT JOIN department d ON p.department = d.id 
       WHERE p.student_id = ?`,
      [student_id]
    );

    const rows = result[0]; // result[0] will hold the rows
    return rows as Patient[];
  } catch (error) {
    throw error;
  }
};

// export interface PatientClinicVisitLogType {
//   student_id: string;
//   cases: string;
//   vitalSigns: string;
//   actions: string;
//   reasons: string;
//   prescription: string;
//   nurseNotes: string;
//   emasOnDuty: string;
//   timestamp: string;
// }

export interface PatientClinicVisitLogType {
  student_id?: string;
  cases?: string;
  vitalSigns?: string;
  actions?: string;
  reasons?: string;
  prescription?: string;
  nurseNotes?: string;
  emasOnDuty?: string;
  timestamp?: string;

  // medical_service table
  medical_services?: Array<{
    chief_complaint?: string;
    attempted_treatment?: string;
    action_taken?: string;
    medication_given?: string;
    medical_quantity?: string | number; // Flexible type to allow for both string and number
  }>;

  // trauma_service table
  trauma_services?: Array<{
    trauma_information?: string;
    management?: string;
    supplies?: string;
    trauma_quantity?: string | number; // Flexible type to allow for both string and number
  }>;

  // vaccination_service table
  vaccination_services?: Array<{
    vaccination_given?: string;
    dose_no?: string;
    purpose?: string;
  }>;

  // medcert table
  medcert_services?: Array<{
    medcert_data?: string;
    medcert_remarks?: string;
  }>;
}

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

export const getPatientClinicVisitLogModel = async (student_id: string): Promise<PatientClinicVisitLogType[]> => {
  try {
    const result = await pool.query(
      `
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
      `,
      [student_id]
    );
    const rows = result[0]; // result[0] will hold the rows
    return rows as PatientClinicVisitLogType[];
  } catch (error) {
    throw error;
  }
};

export interface MergedPatientClinicVisitLogType extends Patient {
  cases: string;
  vitalSigns: string;
  actions: string;
  reasons: string;
  prescription: string;
  nurseNotes: string;
  emasOnDuty: string;
  timestamp: string;
}

export const getStudentRecords = async (student_id: string): Promise<MergedPatientClinicVisitLogType[]> => {
  try {
    const [rows] = await pool.query(
      `SELECT pa.*, p.first_name, p.last_name, p.email, p.sex, p.address, p.date_of_birth, p.contact, p.department, 
              p.height, p.weight, p.bmi, p.bmi_category, p.existing_medical_condition, p.maintenance_medication, 
              p.allergies, p.vaccination_link, p.family_hx_of_illness, p.smoking, p.drinking, p.health_insurance, 
              p.patient_category, p.blood_type, p.profile_photo
       FROM patient_admission pa
       LEFT JOIN patient p ON pa.student_id = p.student_id
       WHERE pa.student_id = ?`,
      [student_id]
    );

    return rows as MergedPatientClinicVisitLogType[];
  } catch (error) {
    console.error("Error fetching student records:", error);
    throw error; // Re-throw the error after logging it
  }
};
