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
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRecords = exports.getPatientClinicVisitLog = exports.getPatientByStudentId = exports.getPatients = exports.deletePatient = exports.savePatient = void 0;
const Patient_1 = require("../models/Patient");
const savePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.action === "add_bulk") {
            try {
                // Extract all student IDs from the incoming bulk data
                const studentIds = req.body.data.map((patient) => patient.student_id);
                // Check if any of the students already exist
                const existingStudents = yield (0, Patient_1.checkstudentExistsBulk)(studentIds);
                if (existingStudents.length > 0) {
                    // Return the student IDs that already exist
                    return res.status(400).json({
                        message: `One or more students already exist: ${existingStudents.join(", ")}`,
                        existingStudentIds: existingStudents,
                    });
                }
                const payload = req.body.data.map((item) => (Object.assign(Object.assign({}, item), { profile_photo: "default-profile.png" })));
                // Proceed to insert new patients in bulk and get the count of rows added
                const rowsAdded = yield (0, Patient_1.addBulkPatients)(payload);
                res.status(201).json({
                    message: `${rowsAdded} Patients added successfully.`,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ message: "Failed to add patients", error: error.message });
                }
                else {
                    res.status(500).json({ message: "An unexpected error occurred" });
                }
            }
        }
        const { student_id, date_of_birth, action } = req.body;
        // Validate the date_of_birth
        if (date_of_birth) {
            const currentDate = new Date(); // Get the current date
            const birthDate = new Date(date_of_birth); // Parse the provided date
            // Check if the birthdate is in the future
            if (birthDate > currentDate) {
                return res.status(400).json({ message: "Birthdate cannot be in the future" });
            }
        }
        if (action === "add") {
            //check student if exist
            const studentExist = yield (0, Patient_1.studentExists)(student_id);
            if (studentExist) {
                return res.status(400).json({ message: "Student already exist" });
            }
            //insert new patient
            yield (0, Patient_1.addNewPatient)(req.body);
            res.status(201).json({ message: "Patient added successfully" });
        }
        if (action === "edit") {
            //check student if exist
            const studentExist = yield (0, Patient_1.studentExists)(student_id);
            if (!studentExist) {
                return res.status(400).json({ message: "Student not exist" });
            }
            yield (0, Patient_1.updatePatient)(req.body);
            res.status(200).json({ message: "Patient update successfully" });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Error creating new patient", error: error.message });
        }
        else {
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.savePatient = savePatient;
const deletePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentID = req.params.student_id;
        const studentExist = yield (0, Patient_1.studentExists)(studentID);
        if (!studentExist) {
            return res.status(400).json({ message: "Student not exist" });
        }
        yield (0, Patient_1.deletePatientByID)(studentID);
        res.status(200).json({ message: "Patient deleted successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Error creating new patient", error: error.message });
        }
        else {
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.deletePatient = deletePatient;
const getPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield (0, Patient_1.getAllPatients)();
        return res.status(200).json(patients);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Error fetching patients", error: error.message });
        }
        else {
            return res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.getPatients = getPatients;
const getPatientByStudentId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { student_id } = req.params; // Assuming student_id is passed as a route parameter
    try {
        const patients = yield (0, Patient_1.getPatientById)(student_id);
        if (patients.length === 0) {
            return res.status(404).json({ message: "No patients found for this student ID" });
        }
        return res.status(200).json(patients);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Error fetching patients", error: error.message });
        }
        else {
            return res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.getPatientByStudentId = getPatientByStudentId;
const getPatientClinicVisitLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { student_id } = req.params; // Assuming student_id is passed as a route parameter
    try {
        const patientsClinicVisitLogs = yield (0, Patient_1.getPatientClinicVisitLogModel)(student_id);
        if (patientsClinicVisitLogs.length === 0) {
            // return res.status(404).json({ message: 'No patients history found for this student ID' });
            return res.status(200).json([]);
        }
        return res.status(200).json(patientsClinicVisitLogs);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Error fetching patients", error: error.message });
        }
        else {
            return res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.getPatientClinicVisitLog = getPatientClinicVisitLog;
const studentRecords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { student_id } = req.params; // Assuming student_id is passed as a route parameter
    try {
        const studzRecords = yield (0, Patient_1.getStudentRecords)(student_id);
        if (studzRecords.length === 0) {
            return res.status(404).json({ message: "No student history found" });
        }
        return res.status(200).json(studzRecords);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Error fetching patients", error: error.message });
        }
        else {
            return res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.studentRecords = studentRecords;
