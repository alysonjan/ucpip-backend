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
exports.getMonthlyPatientDistribution = exports.getCommonDiagnosis = exports.getTotalConsultationsServedByYear = exports.getTotalPatientsByDepartment = exports.getTotalFemalePatientsByYear = exports.getTotalMalePatientsByYear = exports.getTotalReturningPatientsByYear = exports.getTotalNewPatientsByYear = exports.getTotalHealthConcernByYear = exports.getTotalVaccinationByYear = exports.getTotalPhysicalExamsByYear = exports.getTotalPatientsServedByYear = exports.getServiceOfferedByYear = exports.removeChiefComplaint = exports.updateChiefComplaint = exports.createChiefComplaint = exports.checkChiefComplaintIfExist = exports.chiefComplaint = exports.top10_common_reasons = exports.top10_days_with_most_patients = exports.consultation_per_day_of_week = exports.patients_per_day_of_week = exports.consultation_per_month = exports.patients_per_month = exports.overall_patients = exports.overall_visits = exports.getDepartment = exports.checkDepartmentIfExist = exports.checkDepartmentIfExistreturnID = exports.removeDepartment = exports.updateDepartment = exports.createNewDepartment = exports.createNewDepartmentReturnId = void 0;
const database_1 = __importDefault(require("../config/database"));
const createNewDepartmentReturnId = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Execute query and get result
        const [result] = yield database_1.default.query("INSERT INTO department (name) VALUES (?)", [name]);
        // Extract insertId
        return result.insertId;
    }
    catch (error) {
        console.error("Error creating new department:", error);
        throw new Error("Failed to create a new department");
    }
});
exports.createNewDepartmentReturnId = createNewDepartmentReturnId;
// Function to create a new department
const createNewDepartment = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Insert a new department into the database
        yield database_1.default.query("INSERT INTO department (name) VALUES (?)", [name]);
    }
    catch (error) {
        console.error("Error creating new department:", error);
        throw new Error("Failed to create a new department");
    }
});
exports.createNewDepartment = createNewDepartment;
const updateDepartment = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Update the department in the database
        yield database_1.default.query("UPDATE department SET name = ? WHERE id = ?", [name, id]);
    }
    catch (error) {
        console.error("Error updating department:", error);
        throw new Error("Failed to update department");
    }
});
exports.updateDepartment = updateDepartment;
const removeDepartment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Delete the department from the database
        yield database_1.default.query("DELETE FROM department WHERE id = ?", [id]);
    }
    catch (error) {
        console.error("Error deleting department:", error);
        throw new Error("Failed to delete department");
    }
});
exports.removeDepartment = removeDepartment;
const checkDepartmentIfExistreturnID = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.default.query("SELECT id FROM department WHERE name = ?", [name]);
        return rows.length > 0 ? rows[0].id : null;
    }
    catch (error) {
        console.error("Error checking department:", error);
        throw new Error("Failed to check department");
    }
});
exports.checkDepartmentIfExistreturnID = checkDepartmentIfExistreturnID;
const checkDepartmentIfExist = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield database_1.default.query("SELECT * FROM department WHERE name = ?", [name]);
    return rows.length > 0;
});
exports.checkDepartmentIfExist = checkDepartmentIfExist;
// export const checkDepartmentIfExist = async (name: string): Promise<boolean> => {
//   // Query with explicit type annotation for rows
//   const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM department WHERE name = ?", [name]);
//   return rows.length > 0;
// };
const getDepartment = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.default.query("SELECT * FROM department ORDER BY name");
        return rows;
    }
    catch (error) {
        throw error;
    }
});
exports.getDepartment = getDepartment;
const overall_visits = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const [rows] = yield database_1.default.query("SELECT COUNT(id) as total FROM patient_admission" // Alias the result for easier access
        );
        const totalVisits = (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.total; // Extract the count value
        return totalVisits || 0; // Return the count or 0 if undefined
    }
    catch (error) {
        throw error;
    }
});
exports.overall_visits = overall_visits;
const overall_patients = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const [rows] = yield database_1.default.query("SELECT COUNT(id) as total FROM patient" // Query to count total patients
        );
        const totalPatients = (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.total; // Extract the count value
        return totalPatients || 0; // Return the count or 0 if undefined
    }
    catch (error) {
        throw error;
    }
});
exports.overall_patients = overall_patients;
const patients_per_month = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Execute the query
        const [rows] = yield database_1.default.query(`SELECT YEAR(date_added) AS year, MONTH(date_added) AS month, COUNT(id) AS total 
         FROM patient
         GROUP BY YEAR(date_added), MONTH(date_added)
         ORDER BY YEAR(date_added), MONTH(date_added)`);
        // Array of month abbreviations
        const monthAbbreviations = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        // Map the rows to the desired format
        return rows.map((row) => ({
            year: row.year,
            month: monthAbbreviations[row.month - 1], // Convert month number to abbreviation
            total: row.total,
        }));
    }
    catch (error) {
        throw error;
    }
});
exports.patients_per_month = patients_per_month;
const consultation_per_month = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Execute the query
        const [rows] = yield database_1.default.query(`SELECT YEAR(timestamp) AS year, MONTH(timestamp) AS month, COUNT(id) AS total 
         FROM patient_admission
         GROUP BY YEAR(timestamp), MONTH(timestamp)
         ORDER BY YEAR(timestamp), MONTH(timestamp)`);
        // Array of month abbreviations
        const monthAbbreviations = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        // Map the rows to the desired format
        return rows.map((row) => ({
            year: row.year,
            month: monthAbbreviations[row.month - 1], // Convert month number to abbreviation
            total: row.total,
        }));
    }
    catch (error) {
        throw error;
    }
});
exports.consultation_per_month = consultation_per_month;
const patients_per_day_of_week = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Execute the query
        const [rows] = yield database_1.default.query(`SELECT DAYNAME(date_added) AS day, COUNT(id) AS total 
         FROM patient
         GROUP BY day
         ORDER BY FIELD(day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')`);
        // Map the rows to the desired format
        return rows.map((row) => ({
            day: row.day.toUpperCase(), // Convert to uppercase (e.g., MONDAY)
            total: row.total,
        }));
    }
    catch (error) {
        throw error;
    }
});
exports.patients_per_day_of_week = patients_per_day_of_week;
const consultation_per_day_of_week = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Execute the query
        const [rows] = yield database_1.default.query(`SELECT DAYNAME(timestamp) AS day, COUNT(id) AS total 
         FROM patient_admission
         GROUP BY day
         ORDER BY FIELD(day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')`);
        // Map the rows to the desired format
        return rows.map((row) => ({
            day: row.day.toUpperCase(), // Convert to uppercase (e.g., MONDAY)
            total: row.total,
        }));
    }
    catch (error) {
        throw error;
    }
});
exports.consultation_per_day_of_week = consultation_per_day_of_week;
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
const top10_days_with_most_patients = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Execute the query
        const [rows] = yield database_1.default.query(`SELECT DATE(timestamp) AS date, COUNT(id) AS total 
         FROM patient_admission
         GROUP BY date
         ORDER BY total DESC
         LIMIT 10`);
        // Map the rows to the desired format and reformat the date
        return rows.map((row) => ({
            date: row.date.toISOString().split("T")[0], // Convert to YYYY-MM-DD format
            total: row.total,
        }));
    }
    catch (error) {
        throw error;
    }
});
exports.top10_days_with_most_patients = top10_days_with_most_patients;
// Fetch common illnesses
const getCommonIllnesses = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.default.query("SELECT name FROM ucpip.chief_complaints");
        return rows.map((row) => row.name);
    }
    catch (error) {
        console.error("❌ Error fetching common illnesses:", error);
        throw new Error("Failed to fetch common illnesses");
    }
});
// Fetch top 10 common reasons
const top10_common_reasons = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the most common reasons from patient_admission
        const [rows] = yield database_1.default.query(`SELECT COALESCE(NULLIF(chief_complaint, ''), 'Others') AS reason, COUNT(id) AS total 
         FROM medical_service
         GROUP BY chief_complaint
         ORDER BY total DESC
         LIMIT 10`);
        // ✅ Await the function call to get common illnesses before using forEach
        const commonIllnesses = yield getCommonIllnesses();
        // Create a mapping for common illnesses
        const commonReasonsMap = {};
        // Initialize counts for common illnesses
        commonIllnesses.forEach((illness) => {
            commonReasonsMap[illness] = 0;
        });
        // Aggregate the counts for common illnesses and handle "Others"
        rows.forEach((row) => {
            const reason = row.reason;
            const total = row.total;
            if (commonReasonsMap.hasOwnProperty(reason)) {
                commonReasonsMap[reason] += total; // Add count for common reason
            }
            else {
                commonReasonsMap["Others"] = (commonReasonsMap["Others"] || 0) + total; // Add count to "Others"
            }
        });
        // Prepare and return the top 10 results
        return Object.entries(commonReasonsMap)
            .filter(([_, total]) => total > 0) // Remove zero counts
            .map(([reason, total]) => ({ reason, total }))
            .sort((a, b) => b.total - a.total) // Sort by descending order
            .slice(0, 10); // Limit to top 10
    }
    catch (error) {
        console.error("❌ Error fetching top common reasons:", error);
        throw new Error("Failed to fetch top 10 common reasons");
    }
});
exports.top10_common_reasons = top10_common_reasons;
const chiefComplaint = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.default.query("SELECT * FROM chief_complaints ORDER BY name");
        return rows;
    }
    catch (error) {
        throw error;
    }
});
exports.chiefComplaint = chiefComplaint;
const checkChiefComplaintIfExist = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield database_1.default.query("SELECT * FROM chief_complaints WHERE name = ?", [name]);
    return rows.length > 0;
});
exports.checkChiefComplaintIfExist = checkChiefComplaintIfExist;
const createChiefComplaint = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.query("INSERT INTO chief_complaints (name) VALUES (?)", [name]);
    }
    catch (error) {
        console.error("Error creating new complaint:", error);
        throw new Error("Failed to create new chief complaint");
    }
});
exports.createChiefComplaint = createChiefComplaint;
const updateChiefComplaint = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Update the department in the database
        yield database_1.default.query("UPDATE chief_complaints SET name = ? WHERE id = ?", [name, id]);
    }
    catch (error) {
        console.error("Error updating chief_complaint:", error);
        throw new Error("Failed to update chief_complaint");
    }
});
exports.updateChiefComplaint = updateChiefComplaint;
const removeChiefComplaint = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Delete the department from the database
        yield database_1.default.query("DELETE FROM chief_complaints WHERE id = ?", [id]);
    }
    catch (error) {
        console.error("Error deleting chief complaint:", error);
        throw new Error("Failed to delete chief complaint");
    }
});
exports.removeChiefComplaint = removeChiefComplaint;
const getServiceOfferedByYear = (year) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const query = `
      SELECT GROUP_CONCAT(DISTINCT services ORDER BY services SEPARATOR ', ') AS services
      FROM ucpip.patient_admission  
      WHERE YEAR(timestamp) = ?
    `;
        const [rows] = yield database_1.default.query(query, [year]); // Execute query
        return ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.services) || ""; // Return the concatenated string or empty if no result
    }
    catch (error) {
        console.error("Server Error:", error);
        throw new Error("Server Error");
    }
});
exports.getServiceOfferedByYear = getServiceOfferedByYear;
const getTotalPatientsServedByYear = (year) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const query = `
      SELECT COUNT(DISTINCT student_id) AS total_patients
      FROM ucpip.patient
      WHERE YEAR(date_added) = ?
    `;
        const [rows] = yield database_1.default.query(query, [year]); // Execute query
        return ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.total_patients) || 0; // Return total count or 0 if no result
    }
    catch (error) {
        console.error("Server Error:", error);
        throw new Error("Server Error");
    }
});
exports.getTotalPatientsServedByYear = getTotalPatientsServedByYear;
const getTotalPhysicalExamsByYear = (year) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const query = `
      SELECT COUNT(*) AS total
      FROM ucpip.patient_admission  
      WHERE YEAR(timestamp) = ? AND services = 'physical_exam'
    `;
        const [rows] = yield database_1.default.query(query, [year]); // Execute query
        return ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; // Return total count or 0 if no result
    }
    catch (error) {
        console.error("Server Error:", error);
        throw new Error("Server Error");
    }
});
exports.getTotalPhysicalExamsByYear = getTotalPhysicalExamsByYear;
const getTotalVaccinationByYear = (year) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const query = `
      SELECT COUNT(*) AS total
      FROM ucpip.patient_admission  
      WHERE YEAR(timestamp) = ? AND services = 'vaccination'
    `;
        const [rows] = yield database_1.default.query(query, [year]); // Execute query
        return ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; // Return total count or 0 if no result
    }
    catch (error) {
        console.error("Server Error:", error);
        throw new Error("Server Error");
    }
});
exports.getTotalVaccinationByYear = getTotalVaccinationByYear;
const getTotalHealthConcernByYear = (year) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const query = `
      SELECT COUNT(*) AS total
      FROM ucpip.patient_admission  
      WHERE YEAR(timestamp) = ? AND services = 'health_concern'
    `;
        const [rows] = yield database_1.default.query(query, [year]); // Execute query
        return ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; // Return total count or 0 if no result
    }
    catch (error) {
        console.error("Server Error:", error);
        throw new Error("Server Error");
    }
});
exports.getTotalHealthConcernByYear = getTotalHealthConcernByYear;
const getTotalNewPatientsByYear = (year) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        const [rows] = yield database_1.default.query(query, [year, year]); // Execute query
        return ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.total_new_patients) || 0; // Return total count or 0 if no result
    }
    catch (error) {
        console.error("Server Error:", error);
        throw new Error("Server Error");
    }
});
exports.getTotalNewPatientsByYear = getTotalNewPatientsByYear;
const getTotalReturningPatientsByYear = (year) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        const [rows] = yield database_1.default.query(query, [year, year]); // Execute query
        return ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.total_returning_patients) || 0; // Return total count or 0 if no result
    }
    catch (error) {
        console.error("Server Error:", error);
        throw new Error("Server Error");
    }
});
exports.getTotalReturningPatientsByYear = getTotalReturningPatientsByYear;
const getTotalMalePatientsByYear = (year) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const query = `
      SELECT COUNT(DISTINCT pa.student_id) AS total_male_patients
      FROM ucpip.patient_admission pa
      JOIN ucpip.patient p ON pa.student_id = p.student_id
      WHERE YEAR(pa.timestamp) = ? AND p.sex = 'male'
    `;
        const [rows] = yield database_1.default.query(query, [year]); // Execute query
        return ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.total_male_patients) || 0; // Return total count or 0 if no result
    }
    catch (error) {
        console.error("Server Error:", error);
        throw new Error("Server Error");
    }
});
exports.getTotalMalePatientsByYear = getTotalMalePatientsByYear;
const getTotalFemalePatientsByYear = (year) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const query = `
      SELECT COUNT(DISTINCT pa.student_id) AS total_male_patients
      FROM ucpip.patient_admission pa
      JOIN ucpip.patient p ON pa.student_id = p.student_id
      WHERE YEAR(pa.timestamp) = ? AND p.sex = 'female'
    `;
        const [rows] = yield database_1.default.query(query, [year]); // Execute query
        return ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.total_male_patients) || 0; // Return total count or 0 if no result
    }
    catch (error) {
        console.error("Server Error:", error);
        throw new Error("Server Error");
    }
});
exports.getTotalFemalePatientsByYear = getTotalFemalePatientsByYear;
const getTotalPatientsByDepartment = (year) => __awaiter(void 0, void 0, void 0, function* () {
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
        const [rows] = yield database_1.default.query(query, [year]); // Execute query
        const departmentCounts = {};
        rows.forEach((row) => {
            departmentCounts[row.department] = row.total;
        });
        return departmentCounts; // Example: { 'Radtech': 30, 'Medtech': 4, ... }
    }
    catch (error) {
        console.error("Server Error:", error);
        throw new Error("Server Error");
    }
});
exports.getTotalPatientsByDepartment = getTotalPatientsByDepartment;
const getTotalConsultationsServedByYear = (year) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const query = `
      SELECT COUNT(student_id) AS total_patients
      FROM ucpip.patient_admission
      WHERE YEAR(timestamp) = ?
    `;
        const [rows] = yield database_1.default.query(query, [year]); // Execute query
        return ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.total_patients) || 0; // Return total count or 0 if no result
    }
    catch (error) {
        console.error("Server Error:", error);
        throw new Error("Server Error");
    }
});
exports.getTotalConsultationsServedByYear = getTotalConsultationsServedByYear;
const getCommonDiagnosis = (year) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const totalQuery = `SELECT COUNT(*) AS total FROM ucpip.medical_service WHERE YEAR(datetime) = ?`;
        const [totalRows] = yield database_1.default.query(totalQuery, [year]);
        const totalRecords = ((_a = totalRows[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; // Get total count
        if (totalRecords === 0)
            return "No data available";
        const query = `
      SELECT chief_complaint, COUNT(*) AS total
      FROM ucpip.medical_service
      WHERE YEAR(datetime) = ?
      GROUP BY chief_complaint
      ORDER BY total DESC
    `;
        const [rows] = yield database_1.default.query(query, [year]);
        if (rows.length === 0)
            return "No data available";
        // Format result as "Fever: 30%, Diarrhea: 20%, Cough: 15%"
        const formattedResult = rows
            .map((row) => `${row.chief_complaint}: ${((row.total / totalRecords) * 100).toFixed(1)}%`)
            .join(", ");
        return formattedResult;
    }
    catch (error) {
        console.error("Server Error:", error);
        throw new Error("Server Error");
    }
});
exports.getCommonDiagnosis = getCommonDiagnosis;
const getMonthlyPatientDistribution = (year) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
      SELECT MONTH(date_added) AS month, COUNT(DISTINCT student_id) AS total
      FROM ucpip.patient
      WHERE YEAR(date_added) = ?
      GROUP BY month
      ORDER BY month
    `;
        const [rows] = yield database_1.default.query(query, [year]); // Execute query
        if (rows.length === 0)
            return "No data available";
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
            .map((row) => `${monthNames[row.month - 1]}: ${row.total.toLocaleString()}`)
            .join(" , ");
    }
    catch (error) {
        console.error("Server Error:", error);
        throw new Error("Server Error");
    }
});
exports.getMonthlyPatientDistribution = getMonthlyPatientDistribution;
