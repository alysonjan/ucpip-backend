import pool from "../config/database";
import { RowDataPacket } from "mysql2"; // Import RowDataPacket type

export interface MedicalCertificateTypes {
  id: number;
  first_name: string;
  last_name: string;
  sex: string;
  contact: string;
  email: string;
  address: string;
  date_of_birth: string;
  student_id: string;
  department: string;
  profile_photo: string;
  height: string;
  weight: string;
  bmi: string;
  bmi_category: string;
  existing_medical_condition: string;
  maintenance_medication: string;
  allergies: string;
  vaccination_link: string;
  family_hx_of_illness: string;
  smoking: string;
  drinking: string;
  health_insurance: string;
  patient_category: string;
  blood_type: string;
  deleted: number;
  cases: string;
  vital_signs: string;
  actions: string;
  reasons: string;
  prescription: string;
  nurse_notes: string;
  emas_on_duty: string;
  timestamp: string;
}

// Ensure the query returns RowDataPacket[]
export const getMedicalCertificateRecord = async (student_id: string): Promise<any | null> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>( // Use RowDataPacket[]
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
            LIMIT 1`,
      [student_id]
    );

    // If there are rows, return the first row as MedicalCertificateTypes
    if (rows.length > 0) {
      return rows[0] as any; // Cast to MedicalCertificateTypes
    } else {
      return null; // No records found
    }
  } catch (error) {
    throw error; // You can add more specific error handling if needed
  }
};

export const getMedicalDoctor = async (doctor_id: string): Promise<any | null> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>( // Use RowDataPacket[]
      `SELECT * FROM doctors WHERE id = ?`,
      [doctor_id]
    );

    // If there are rows, return the first row as MedicalCertificateTypes
    if (rows.length > 0) {
      return rows[0] as any; // Cast to MedicalCertificateTypes
    } else {
      return null; // No records found
    }
  } catch (error) {
    throw error; // You can add more specific error handling if needed
  }
};
