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
exports.updateUserContactNumber = exports.updateUserStatus = exports.getAllUsers = exports.createUser = exports.getUserByEmail = exports.getUserByStudentId = exports.emailExists = exports.updatePassword = exports.createPassword = exports.isUserPasswordAlreadyActivated = void 0;
const database_1 = __importDefault(require("../config/database"));
const auth_1 = require("../utils/auth");
// Check if a user's password is already activated
const isUserPasswordAlreadyActivated = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const [result] = yield database_1.default.query("SELECT password_activation FROM users WHERE email = ?", [email]);
    const rows = result; // Type assertion for rows
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
});
exports.isUserPasswordAlreadyActivated = isUserPasswordAlreadyActivated;
const createPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield (0, auth_1.hashPassword)(password);
        const [result] = yield database_1.default.query(`UPDATE users 
       SET temp_password = ?, password = ?, active = ?, password_activation = ?
       WHERE email = ?`, ["", hashedPassword, 1, 1, email]);
        // Check if rows were affected by the query
        return result.affectedRows > 0;
    }
    catch (error) {
        // Improved error logging
        console.error("Error in createPassword:", error); // Log the error for debugging
        return false; // Return false if an error occurred
    }
});
exports.createPassword = createPassword;
const updatePassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield (0, auth_1.hashPassword)(password);
        const [result] = yield database_1.default.query(`UPDATE users 
       SET password = ?
       WHERE email = ?`, [hashedPassword, email]);
        // Check if rows were affected by the query
        return result.affectedRows > 0;
    }
    catch (error) {
        // Improved error logging
        console.error("Error in updatingPassword:", error); // Log the error for debugging
        return false; // Return false if an error occurred
    }
});
exports.updatePassword = updatePassword;
// check if an email already exists
const emailExists = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield database_1.default.query("SELECT 1 FROM users WHERE email = ?", [email]);
    return rows.length > 0;
});
exports.emailExists = emailExists;
const getUserByStudentId = (student_id) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield database_1.default.query("SELECT * FROM patient WHERE student_id = ?", [student_id]);
    return rows.length > 0 ? rows[0] : null; // Return the first row or null if not found
});
exports.getUserByStudentId = getUserByStudentId;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield database_1.default.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows.length > 0 ? rows[0] : null;
});
exports.getUserByEmail = getUserByEmail;
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // const hashedPassword = await hashPassword(user.password);
    const dateNow = new Date();
    yield database_1.default.query("INSERT INTO users (firstname, lastname, email, temp_password, role, created_at) VALUES (?, ?, ?, ?, ?, ?)", [user.firstname, user.lastname, user.email, user.temp_password, user.role, dateNow]);
});
exports.createUser = createUser;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield database_1.default.query("SELECT * FROM users WHERE role IN ('admin', 'staff') ORDER BY firstname"); //DO NOT INCLUDE SUPERADMIN
    // Map the result to the User type without the password field
    return rows.map((user) => ({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        active: user.active,
    }));
});
exports.getAllUsers = getAllUsers;
const updateUserStatus = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure the result from the tuple
        const [result] = yield database_1.default.query(`UPDATE users 
       SET active = ?
       WHERE id = ?`, [user.active, user.id]);
        // Check if rows were affected by the query
        return result.affectedRows > 0;
    }
    catch (error) {
        console.log(error); // Log the error for debugging
        return false; // Return false if an error occurred
    }
});
exports.updateUserStatus = updateUserStatus;
const updateUserContactNumber = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure the result from the tuple
        const [result] = yield database_1.default.query(`UPDATE users 
       SET contact_number = ?
       WHERE id = ?`, [user.contact_number, user.id]);
        // Check if rows were affected by the query
        return result.affectedRows > 0;
    }
    catch (error) {
        console.log(error); // Log the error for debugging
        return false; // Return false if an error occurred
    }
});
exports.updateUserContactNumber = updateUserContactNumber;
