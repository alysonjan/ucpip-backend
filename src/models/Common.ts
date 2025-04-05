import pool from "../config/database";
import { RowDataPacket } from "mysql2"; // Import the RowDataPacket type
import { ResultSetHeader } from "mysql2/promise";

export interface Department {
  id: string;
  name: string;
}

export interface ChiefComplaint {
  id: number;
  name: string;
}

export const createNewDepartmentReturnId = async (name: string): Promise<number> => {
  try {
    // Execute query and get result
    const [result] = await pool.query<ResultSetHeader>("INSERT INTO department (name) VALUES (?)", [name]);

    // Extract insertId
    return result.insertId;
  } catch (error) {
    console.error("Error creating new department:", error);
    throw new Error("Failed to create a new department");
  }
};

// Function to create a new department
export const createNewDepartment = async (name: Department): Promise<void> => {
  try {
    // Insert a new department into the database
    await pool.query("INSERT INTO department (name) VALUES (?)", [name]);
  } catch (error) {
    console.error("Error creating new department:", error);
    throw new Error("Failed to create a new department");
  }
};

export const updateDepartment = async (id: string, name: string): Promise<void> => {
  try {
    // Update the department in the database
    await pool.query("UPDATE department SET name = ? WHERE id = ?", [name, id]);
  } catch (error) {
    console.error("Error updating department:", error);
    throw new Error("Failed to update department");
  }
};

export const removeDepartment = async (id: string): Promise<void> => {
  try {
    // Delete the department from the database
    await pool.query("DELETE FROM department WHERE id = ?", [id]);
  } catch (error) {
    console.error("Error deleting department:", error);
    throw new Error("Failed to delete department");
  }
};

export const checkDepartmentIfExistreturnID = async (name: string): Promise<number | null> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT id FROM department WHERE name = ?", [name]);

    return rows.length > 0 ? rows[0].id : null;
  } catch (error) {
    console.error("Error checking department:", error);
    throw new Error("Failed to check department");
  }
};
export const checkDepartmentIfExist = async (name: string): Promise<boolean> => {
  const [rows] = await pool.query("SELECT * FROM department WHERE name = ?", [name]);
  return (rows as any).length > 0;
};

// export const checkDepartmentIfExist = async (name: string): Promise<boolean> => {
//   // Query with explicit type annotation for rows
//   const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM department WHERE name = ?", [name]);
//   return rows.length > 0;
// };

export const getDepartment = async (): Promise<Department[]> => {
  try {
    const [rows] = await pool.query("SELECT * FROM department ORDER BY name");
    return rows as Department[];
  } catch (error) {
    throw error;
  }
};

export const overall_visits = async (): Promise<number> => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(id) as total FROM patient_admission" // Alias the result for easier access
    );
    const totalVisits = (rows as any[])[0]?.total; // Extract the count value
    return totalVisits || 0; // Return the count or 0 if undefined
  } catch (error) {
    throw error;
  }
};

export const overall_patients = async (): Promise<number> => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(id) as total FROM patient" // Query to count total patients
    );
    const totalPatients = (rows as any[])[0]?.total; // Extract the count value
    return totalPatients || 0; // Return the count or 0 if undefined
  } catch (error) {
    throw error;
  }
};

export const patients_per_month = async (): Promise<{ year: number; month: string; total: number }[]> => {
  try {
    // Execute the query
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
      `SELECT YEAR(date_added) AS year, MONTH(date_added) AS month, COUNT(id) AS total 
         FROM patient
         GROUP BY YEAR(date_added), MONTH(date_added)
         ORDER BY YEAR(date_added), MONTH(date_added)`
    );

    // Array of month abbreviations
    const monthAbbreviations = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    // Map the rows to the desired format
    return rows.map((row) => ({
      year: row.year,
      month: monthAbbreviations[row.month - 1], // Convert month number to abbreviation
      total: row.total,
    }));
  } catch (error) {
    throw error;
  }
};

export const consultation_per_month = async (): Promise<{ year: number; month: string; total: number }[]> => {
  try {
    // Execute the query
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
      `SELECT YEAR(timestamp) AS year, MONTH(timestamp) AS month, COUNT(id) AS total 
         FROM patient_admission
         GROUP BY YEAR(timestamp), MONTH(timestamp)
         ORDER BY YEAR(timestamp), MONTH(timestamp)`
    );

    // Array of month abbreviations
    const monthAbbreviations = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    // Map the rows to the desired format
    return rows.map((row) => ({
      year: row.year,
      month: monthAbbreviations[row.month - 1], // Convert month number to abbreviation
      total: row.total,
    }));
  } catch (error) {
    throw error;
  }
};

export const patients_per_day_of_week = async (): Promise<{ day: string; total: number }[]> => {
  try {
    // Execute the query
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
      `SELECT DAYNAME(date_added) AS day, COUNT(id) AS total 
         FROM patient
         GROUP BY day
         ORDER BY FIELD(day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')`
    );

    // Map the rows to the desired format
    return rows.map((row) => ({
      day: row.day.toUpperCase(), // Convert to uppercase (e.g., MONDAY)
      total: row.total,
    }));
  } catch (error) {
    throw error;
  }
};

export const consultation_per_day_of_week = async (): Promise<{ day: string; total: number }[]> => {
  try {
    // Execute the query
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
      `SELECT DAYNAME(timestamp) AS day, COUNT(id) AS total 
         FROM patient_admission
         GROUP BY day
         ORDER BY FIELD(day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')`
    );

    // Map the rows to the desired format
    return rows.map((row) => ({
      day: row.day.toUpperCase(), // Convert to uppercase (e.g., MONDAY)
      total: row.total,
    }));
  } catch (error) {
    throw error;
  }
};

// export const top10_days_with_most_patients = async (): Promise<{ date: string; total: number }[]> => {
//   try {
//     // Execute the query
//     const [rows]: [RowDataPacket[], unknown] = await pool.query(
//       `SELECT DATE(date_added) AS date, COUNT(id) AS total
//          FROM patient
//          GROUP BY date
//          ORDER BY total DESC
//          LIMIT 10`
//     );

//     // Map the rows to the desired format and reformat the date
//     return rows.map((row) => ({
//       date: row.date.toISOString().split("T")[0], // Convert to YYYY-MM-DD format
//       total: row.total,
//     }));
//   } catch (error) {
//     throw error;
//   }
// };

export const top10_days_with_most_patients = async (): Promise<{ date: string; total: number }[]> => {
  try {
    // Execute the query
    const [rows]: [RowDataPacket[], unknown] = await pool.query(
      `SELECT DATE(timestamp) AS date, COUNT(id) AS total 
         FROM patient_admission
         GROUP BY date
         ORDER BY total DESC
         LIMIT 10`
    );

    // Map the rows to the desired format and reformat the date
    return rows.map((row) => ({
      date: row.date.toISOString().split("T")[0], // Convert to YYYY-MM-DD format
      total: row.total,
    }));
  } catch (error) {
    throw error;
  }
};

// const commonIllnesses = [
//   "Headache",
//   "Diarrhea",
//   "Muscle Pain",
//   "Fever",
//   "Nausea",
//   "Cough",
//   "Cold",
//   "Allergy",
//   "Stomach Pain",
//   "Sore Throat",
//   "Fatigue",
//   "Vomiting",
//   "Back Pain",
//   "Chest Pain",
//   "Rash",
//   "Dizziness",
//   "Shortness of Breath",
//   "Skin Irritation",
//   "Joint Pain",
//   "Injury",
//   "Other",
// ];

interface ReasonCount {
  reason: string;
  total: number;
}

// Fetch common illnesses
const getCommonIllnesses = async (): Promise<string[]> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT name FROM ucpip.chief_complaints");
    return rows.map((row) => row.name);
  } catch (error) {
    console.error("❌ Error fetching common illnesses:", error);
    throw new Error("Failed to fetch common illnesses");
  }
};

// Fetch top 10 common reasons
export const top10_common_reasons = async (): Promise<ReasonCount[]> => {
  try {
    // Get the most common reasons from patient_admission
    const [rows]: [Array<RowDataPacket & { reason: string; total: number }>, unknown] = await pool.query(
      `SELECT COALESCE(NULLIF(chief_complaint, ''), 'Others') AS reason, COUNT(id) AS total 
         FROM medical_service
         GROUP BY chief_complaint
         ORDER BY total DESC
         LIMIT 10`
    );

    // ✅ Await the function call to get common illnesses before using forEach
    const commonIllnesses = await getCommonIllnesses();

    // Create a mapping for common illnesses
    const commonReasonsMap: { [key: string]: number } = {};

    // Initialize counts for common illnesses
    commonIllnesses.forEach((illness) => {
      commonReasonsMap[illness] = 0;
    });

    // Aggregate the counts for common illnesses and handle "Others"
    rows.forEach((row) => {
      const reason: string = row.reason;
      const total: number = row.total;

      if (commonReasonsMap.hasOwnProperty(reason)) {
        commonReasonsMap[reason] += total; // Add count for common reason
      } else {
        commonReasonsMap["Others"] = (commonReasonsMap["Others"] || 0) + total; // Add count to "Others"
      }
    });

    // Prepare and return the top 10 results
    return Object.entries(commonReasonsMap)
      .filter(([_, total]) => total > 0) // Remove zero counts
      .map(([reason, total]) => ({ reason, total }))
      .sort((a, b) => b.total - a.total) // Sort by descending order
      .slice(0, 10); // Limit to top 10
  } catch (error) {
    console.error("❌ Error fetching top common reasons:", error);
    throw new Error("Failed to fetch top 10 common reasons");
  }
};

export const chiefComplaint = async (): Promise<ChiefComplaint[]> => {
  try {
    const [rows] = await pool.query("SELECT * FROM chief_complaints ORDER BY name");
    return rows as ChiefComplaint[];
  } catch (error) {
    throw error;
  }
};

export const checkChiefComplaintIfExist = async (name: string): Promise<boolean> => {
  const [rows] = await pool.query("SELECT * FROM chief_complaints WHERE name = ?", [name]);
  return (rows as any).length > 0;
};

export const createChiefComplaint = async (name: ChiefComplaint): Promise<void> => {
  try {
    await pool.query("INSERT INTO chief_complaints (name) VALUES (?)", [name]);
  } catch (error) {
    console.error("Error creating new complaint:", error);
    throw new Error("Failed to create new chief complaint");
  }
};

export const updateChiefComplaint = async (id: string, name: string): Promise<void> => {
  try {
    // Update the department in the database
    await pool.query("UPDATE chief_complaints SET name = ? WHERE id = ?", [name, id]);
  } catch (error) {
    console.error("Error updating chief_complaint:", error);
    throw new Error("Failed to update chief_complaint");
  }
};

export const removeChiefComplaint = async (id: number): Promise<void> => {
  try {
    // Delete the department from the database
    await pool.query("DELETE FROM chief_complaints WHERE id = ?", [id]);
  } catch (error) {
    console.error("Error deleting chief complaint:", error);
    throw new Error("Failed to delete chief complaint");
  }
};

export const getServiceOfferedByYear = async (year: string): Promise<void> => {
  try {
    const query = `
      SELECT GROUP_CONCAT(DISTINCT services ORDER BY services SEPARATOR ', ') AS services
      FROM ucpip.patient_admission  
      WHERE YEAR(timestamp) = ?
    `;

    const [rows]: any = await pool.query(query, [year]); // Execute query
    return rows[0]?.services || ""; // Return the concatenated string or empty if no result
  } catch (error) {
    console.error("Server Error:", error);
    throw new Error("Server Error");
  }
};

export const getTotalPatientsServedByYear = async (year: string): Promise<number> => {
  try {
    const query = `
      SELECT COUNT(DISTINCT student_id) AS total_patients
      FROM ucpip.patient
      WHERE YEAR(date_added) = ?
    `;

    const [rows]: any = await pool.query(query, [year]); // Execute query
    return rows[0]?.total_patients || 0; // Return total count or 0 if no result
  } catch (error) {
    console.error("Server Error:", error);
    throw new Error("Server Error");
  }
};

export const getTotalPhysicalExamsByYear = async (year: string): Promise<number> => {
  try {
    const query = `
      SELECT COUNT(*) AS total
      FROM ucpip.patient_admission  
      WHERE YEAR(timestamp) = ? AND services = 'physical_exam'
    `;

    const [rows]: any = await pool.query(query, [year]); // Execute query
    return rows[0]?.total || 0; // Return total count or 0 if no result
  } catch (error) {
    console.error("Server Error:", error);
    throw new Error("Server Error");
  }
};

export const getTotalVaccinationByYear = async (year: string): Promise<number> => {
  try {
    const query = `
      SELECT COUNT(*) AS total
      FROM ucpip.patient_admission  
      WHERE YEAR(timestamp) = ? AND services = 'vaccination'
    `;

    const [rows]: any = await pool.query(query, [year]); // Execute query
    return rows[0]?.total || 0; // Return total count or 0 if no result
  } catch (error) {
    console.error("Server Error:", error);
    throw new Error("Server Error");
  }
};

export const getTotalHealthConcernByYear = async (year: string): Promise<number> => {
  try {
    const query = `
      SELECT COUNT(*) AS total
      FROM ucpip.patient_admission  
      WHERE YEAR(timestamp) = ? AND services = 'health_concern'
    `;

    const [rows]: any = await pool.query(query, [year]); // Execute query
    return rows[0]?.total || 0; // Return total count or 0 if no result
  } catch (error) {
    console.error("Server Error:", error);
    throw new Error("Server Error");
  }
};

export const getTotalNewPatientsByYear = async (year: string): Promise<number> => {
  try {
    const query = `
      SELECT COUNT(DISTINCT student_id) AS total_new_patients
      FROM ucpip.patient_admission
      WHERE YEAR(timestamp) = ?
      AND student_id NOT IN (
        SELECT DISTINCT student_id 
        FROM ucpip.patient_admission 
        WHERE YEAR(timestamp) < ?
      )
    `;

    const [rows]: any = await pool.query(query, [year, year]); // Execute query
    return rows[0]?.total_new_patients || 0; // Return total count or 0 if no result
  } catch (error) {
    console.error("Server Error:", error);
    throw new Error("Server Error");
  }
};

export const getTotalReturningPatientsByYear = async (year: string): Promise<number> => {
  try {
    const query = `
      SELECT COUNT(DISTINCT student_id) AS total_returning_patients
      FROM ucpip.patient_admission
      WHERE YEAR(timestamp) = ?
      AND student_id IN (
        SELECT DISTINCT student_id 
        FROM ucpip.patient_admission 
        WHERE YEAR(timestamp) < ?
      )
    `;

    const [rows]: any = await pool.query(query, [year, year]); // Execute query
    return rows[0]?.total_returning_patients || 0; // Return total count or 0 if no result
  } catch (error) {
    console.error("Server Error:", error);
    throw new Error("Server Error");
  }
};

export const getTotalMalePatientsByYear = async (year: string): Promise<number> => {
  try {
    const query = `
      SELECT COUNT(DISTINCT pa.student_id) AS total_male_patients
      FROM ucpip.patient_admission pa
      JOIN ucpip.patient p ON pa.student_id = p.student_id
      WHERE YEAR(pa.timestamp) = ? AND p.sex = 'male'
    `;

    const [rows]: any = await pool.query(query, [year]); // Execute query
    return rows[0]?.total_male_patients || 0; // Return total count or 0 if no result
  } catch (error) {
    console.error("Server Error:", error);
    throw new Error("Server Error");
  }
};

export const getTotalFemalePatientsByYear = async (year: string): Promise<number> => {
  try {
    const query = `
      SELECT COUNT(DISTINCT pa.student_id) AS total_male_patients
      FROM ucpip.patient_admission pa
      JOIN ucpip.patient p ON pa.student_id = p.student_id
      WHERE YEAR(pa.timestamp) = ? AND p.sex = 'female'
    `;

    const [rows]: any = await pool.query(query, [year]); // Execute query
    return rows[0]?.total_male_patients || 0; // Return total count or 0 if no result
  } catch (error) {
    console.error("Server Error:", error);
    throw new Error("Server Error");
  }
};

export const getTotalPatientsByDepartment = async (year: string): Promise<any> => {
  try {
    const query = `
      SELECT COALESCE(d.name, 'Unknown') AS department, COUNT(pa.student_id) AS total
      FROM ucpip.patient_admission pa
      LEFT JOIN ucpip.patient p ON pa.student_id = p.student_id
      LEFT JOIN ucpip.department d ON p.department = d.id
      WHERE YEAR(pa.timestamp) = ?
      GROUP BY department
      ORDER BY total DESC
    `;

    const [rows]: any = await pool.query(query, [year]); // Execute query

    const departmentCounts: any = {};
    rows.forEach((row: any) => {
      departmentCounts[row.department] = row.total;
    });

    return departmentCounts; // Example: { 'Radtech': 30, 'Medtech': 4, ... }
  } catch (error) {
    console.error("Server Error:", error);
    throw new Error("Server Error");
  }
};

export const getTotalConsultationsServedByYear = async (year: string): Promise<number> => {
  try {
    const query = `
      SELECT COUNT(student_id) AS total_patients
      FROM ucpip.patient_admission
      WHERE YEAR(timestamp) = ?
    `;

    const [rows]: any = await pool.query(query, [year]); // Execute query
    return rows[0]?.total_patients || 0; // Return total count or 0 if no result
  } catch (error) {
    console.error("Server Error:", error);
    throw new Error("Server Error");
  }
};

export const getCommonDiagnosis = async (year: string): Promise<string> => {
  try {
    const totalQuery = `SELECT COUNT(*) AS total FROM ucpip.medical_service WHERE YEAR(datetime) = ?`;
    const [totalRows]: any = await pool.query(totalQuery, [year]);

    const totalRecords = totalRows[0]?.total || 0; // Get total count
    if (totalRecords === 0) return "No data available";

    const query = `
      SELECT chief_complaint, COUNT(*) AS total
      FROM ucpip.medical_service
      WHERE YEAR(datetime) = ?
      GROUP BY chief_complaint
      ORDER BY total DESC
    `;

    const [rows]: any = await pool.query(query, [year]);

    if (rows.length === 0) return "No data available";

    // Format result as "Fever: 30%, Diarrhea: 20%, Cough: 15%"
    const formattedResult = rows
      .map(
        (row: { chief_complaint: string; total: number }) =>
          `${row.chief_complaint}: ${((row.total / totalRecords) * 100).toFixed(1)}%`
      )
      .join(", ");

    return formattedResult;
  } catch (error) {
    console.error("Server Error:", error);
    throw new Error("Server Error");
  }
};

export const getMonthlyPatientDistribution = async (year: string): Promise<string> => {
  try {
    const query = `
      SELECT MONTH(date_added) AS month, COUNT(DISTINCT student_id) AS total
      FROM ucpip.patient
      WHERE YEAR(date_added) = ?
      GROUP BY month
      ORDER BY month
    `;

    const [rows]: any = await pool.query(query, [year]); // Execute query

    if (rows.length === 0) return "No data available";

    // Define month mapping
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Convert result into formatted string like "January: 1,250, February: 1,100"
    return rows
      .map((row: { month: number; total: number }) => `${monthNames[row.month - 1]}: ${row.total.toLocaleString()}`)
      .join(" , ");
  } catch (error) {
    console.error("Server Error:", error);
    throw new Error("Server Error");
  }
};
