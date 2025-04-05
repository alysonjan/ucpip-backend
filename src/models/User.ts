import { RowDataPacket } from "mysql2";
import pool from "../config/database";
import { hashPassword } from "../utils/auth";

export interface User {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  temp_password?: string;
  password?: string;
  role?: string;
  active?: number;
  created_at?: string;
  password_activation?: number;
  contact_number?: string;
}

// Check if a user's password is already activated
export const isUserPasswordAlreadyActivated = async (email: string): Promise<boolean> => {
  const [result] = await pool.query("SELECT password_activation FROM users WHERE email = ?", [email]);

  const rows = result as Array<{ password_activation: number }>; // Type assertion for rows

  console.log("Query result:", rows); // Log the result for debugging

  // Check if the user exists
  if (rows.length > 0) {
    const { password_activation } = rows[0]; // Extract the password_activation value
    console.log("Password activation status:", password_activation); // Log the status

    // Return true if activated, false if not (assuming 0 means not activated)
    return password_activation !== 0; // If password_activation is 0, return false; else return true
  }

  console.log("User does not exist"); // Log if the user does not exist
  return false; // User does not exist
};

export const createPassword = async (email: string, password: string): Promise<boolean> => {
  try {
    const hashedPassword = await hashPassword(password);

    const [result] = await pool.query(
      `UPDATE users 
       SET temp_password = ?, password = ?, active = ?, password_activation = ?
       WHERE email = ?`,
      ["", hashedPassword, 1, 1, email]
    );

    // Check if rows were affected by the query
    return (result as any).affectedRows > 0;
  } catch (error) {
    // Improved error logging
    console.error("Error in createPassword:", error); // Log the error for debugging
    return false; // Return false if an error occurred
  }
};

export const updatePassword = async (email: string, password: string): Promise<boolean> => {
  try {
    const hashedPassword = await hashPassword(password);

    const [result] = await pool.query(
      `UPDATE users 
       SET password = ?
       WHERE email = ?`,
      [hashedPassword, email]
    );

    // Check if rows were affected by the query
    return (result as any).affectedRows > 0;
  } catch (error) {
    // Improved error logging
    console.error("Error in updatingPassword:", error); // Log the error for debugging
    return false; // Return false if an error occurred
  }
};

// check if an email already exists
export const emailExists = async (email: string): Promise<boolean> => {
  const [rows] = await pool.query("SELECT 1 FROM users WHERE email = ?", [email]);
  return (rows as any).length > 0;
};

export const getUserByStudentId = async (student_id: number): Promise<any | null> => {
  const [rows] = await pool.query("SELECT * FROM patient WHERE student_id = ?", [student_id]);
  return (rows as any).length > 0 ? (rows as any)[0] : null; // Return the first row or null if not found
};

export const getUserByEmail = async (email: string): Promise<RowDataPacket | null> => {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM users WHERE email = ?", [email]);

  return rows.length > 0 ? rows[0] : null;
};

export const createUser = async (user: User): Promise<void> => {
  // const hashedPassword = await hashPassword(user.password);
  const dateNow = new Date();

  await pool.query(
    "INSERT INTO users (firstname, lastname, email, temp_password, role, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [user.firstname, user.lastname, user.email, user.temp_password, user.role, dateNow]
  );
};

export const getAllUsers = async (): Promise<Omit<User, "password">[]> => {
  const [rows] = await pool.query("SELECT * FROM users WHERE role IN ('admin', 'staff') ORDER BY firstname"); //DO NOT INCLUDE SUPERADMIN

  // Map the result to the User type without the password field
  return (rows as any).map(
    (user: { id: number; firstname: string; lastname: string; email: string; role: string; active: number }) => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      active: user.active,
    })
  );
};

export const updateUserStatus = async (user: User): Promise<boolean> => {
  try {
    // Destructure the result from the tuple
    const [result] = await pool.query(
      `UPDATE users 
       SET active = ?
       WHERE id = ?`,
      [user.active, user.id]
    );

    // Check if rows were affected by the query
    return (result as any).affectedRows > 0;
  } catch (error) {
    console.log(error); // Log the error for debugging
    return false; // Return false if an error occurred
  }
};

export const updateUserContactNumber = async (user: User): Promise<boolean> => {
  try {
    // Destructure the result from the tuple
    const [result] = await pool.query(
      `UPDATE users 
       SET contact_number = ?
       WHERE id = ?`,
      [user.contact_number, user.id]
    );

    // Check if rows were affected by the query
    return (result as any).affectedRows > 0;
  } catch (error) {
    console.log(error); // Log the error for debugging
    return false; // Return false if an error occurred
  }
};
