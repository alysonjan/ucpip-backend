import pool from "../config/database";
import { RowDataPacket } from "mysql2"; // Import the RowDataPacket type

export interface Doctor {
  id?: string;
  fullname: string;
  prc_license: string;
  signature?: string;
}

export const checkDoctorIfExist = async (prc_license: string): Promise<boolean> => {
  const [rows] = await pool.query("SELECT * FROM doctors WHERE prc_license = ?", [prc_license]);
  return (rows as any).length > 0;
};

export const createNewDoctor = async (doctor: Doctor): Promise<void> => {
  try {
    await pool.query("INSERT INTO doctors (fullname, prc_license, signature, created_at) VALUES (?,?,?,?)", [
      doctor.fullname,
      doctor.prc_license,
      doctor.signature,
      new Date(),
    ]);
  } catch (error) {
    console.error("Error adding new doctor:", error);
    throw new Error("Failed to add a new doctor");
  }
};

export const updateDoctor = async (doctor: Doctor): Promise<void> => {
  try {
    await pool.query("UPDATE doctors SET fullname = ?, prc_license = ?, created_at = ? WHERE id = ?", [
      doctor.fullname,
      doctor.prc_license,
      new Date(),
      doctor.id,
    ]);
  } catch (error) {
    console.error("Error updating doctor:", error);
    throw new Error("Failed to update doctor");
  }
};

export const removeDoctor = async (id: string): Promise<void> => {
  try {
    await pool.query("DELETE FROM doctors WHERE prc_license = ?", [id]);
  } catch (error) {
    console.error("Error deleting doctors:", error);
    throw new Error("Failed to delete doctors");
  }
};

export const getDoctors = async (): Promise<Doctor[]> => {
  try {
    const [rows] = await pool.query("SELECT * FROM doctors ORDER BY fullname");
    return rows as Doctor[];
  } catch (error) {
    throw error;
  }
};
