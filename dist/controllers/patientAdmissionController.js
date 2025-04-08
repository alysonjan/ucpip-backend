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
exports.deletePatientAdmission = exports.getPatientAdmiById = exports.getPatientAdmissions = exports.newEditPatientAdmission = exports.editPatientAdmission = exports.addPatientAdmission = exports.newConsultation = void 0;
const Patient_1 = require("../models/Patient");
const PatientAdmission_1 = require("../models/PatientAdmission");
const newConsultation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { first_name, last_name, email, student_id, sex, address, date_of_birth, contact, department, profile_photo, nurseNotes, emasOnDuty, timestamp, temperature, pulse_rate, respiratory_rate, blood_pressure, oxygen_saturation, pain_scale, 
        // ########################################
        chief_complaint, working_diagnosis, signs_and_symptoms, allergies, case_type, medication, quantity, past_medical_history, assessment, remarks, reason_for_consultation, 
        // ########################################
        status, physical_exam_remarks, 
        // ########################################
        vaccination_given, dose_no, purpose, consultation_service, 
        // ########################################
        medcert_data, medcert_remarks, } = req.body;
        //check student if exist
        const studentExist = yield (0, Patient_1.studentExists)(student_id);
        if (!studentExist) {
            const newPatientPayload = {
                first_name,
                last_name,
                email,
                student_id,
                sex,
                address,
                date_of_birth,
                contact,
                department,
                profile_photo,
            };
            yield (0, Patient_1.addNewPatient)(newPatientPayload);
            res.status(201).json({ message: "Patient Admission added successfully" });
        }
        // ############################################################################################3
        if (consultation_service === "health_concern") {
            const newPatientAdmissionPayloadMedical = {
                student_id,
                nurseNotes,
                emasOnDuty,
                timestamp,
                temperature,
                pulse_rate,
                respiratory_rate,
                blood_pressure,
                oxygen_saturation,
                pain_scale,
                // ############################
                chief_complaint,
                working_diagnosis,
                signs_and_symptoms,
                allergies,
                case_type,
                medication,
                quantity,
                past_medical_history,
                assessment,
                remarks,
                reason_for_consultation,
            };
            // create new patient admission record
            yield (0, PatientAdmission_1.addNewConsultationMedical)(newPatientAdmissionPayloadMedical);
            res.status(201).json({ message: "Success" });
        }
        else if (consultation_service === "med_certificate") {
            const newPatientAdmissionPayloadMedCert = {
                student_id,
                nurseNotes,
                emasOnDuty,
                timestamp,
                temperature,
                pulse_rate,
                respiratory_rate,
                blood_pressure,
                oxygen_saturation,
                pain_scale,
                // ############################
                medcert_data,
                medcert_remarks,
            };
            yield (0, PatientAdmission_1.addNewConsultationMedcert)(newPatientAdmissionPayloadMedCert);
            res.status(201).json({ message: "Success" });
        }
        else if (consultation_service === "physical_exam") {
            const newPatientAdmissionPayloadTrauma = {
                student_id,
                nurseNotes,
                emasOnDuty,
                timestamp,
                temperature,
                pulse_rate,
                respiratory_rate,
                blood_pressure,
                oxygen_saturation,
                pain_scale,
                // ############################
                status,
                physical_exam_remarks,
            };
            yield (0, PatientAdmission_1.addNewConsultationPhysicalExam)(newPatientAdmissionPayloadTrauma);
            res.status(201).json({ message: "Success" });
        }
        else if (consultation_service === "vaccination") {
            const newPatientAdmissionPayloadVaccination = {
                student_id,
                nurseNotes,
                emasOnDuty,
                timestamp,
                temperature,
                pulse_rate,
                respiratory_rate,
                blood_pressure,
                oxygen_saturation,
                pain_scale,
                vaccination_given,
                dose_no,
                purpose,
            };
            yield (0, PatientAdmission_1.addNewConsultationVaccination)(newPatientAdmissionPayloadVaccination);
            res.status(201).json({ message: "Success" });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Error Consultation", error: error.message });
        }
        else {
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.newConsultation = newConsultation;
const addPatientAdmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { first_name, // Changed from firstname to first_name
        last_name, // Changed from lastname to last_name
        email, student_id, // Changed from studentID to student_id
        sex, address, date_of_birth, // Changed from dateOfBirth to date_of_birth
        contact, department, profile_photo, // Changed from profile_photo (already matches)
        cases, vitalSigns, // Changed from vitalSigns to vitalSigns (already matches)
        actions, common_reasons, reasons, prescription, nurseNotes, // Changed from nurseNotes (already matches)
        emasOnDuty, // Changed from emasOnDuty (already matches)
        timestamp, // Changed from timestamp (already matches)
         } = req.body;
        //check student if exist
        const studentExist = yield (0, Patient_1.studentExists)(student_id);
        if (!studentExist) {
            const newPatientPayload = {
                first_name,
                last_name,
                email,
                student_id,
                sex,
                address,
                date_of_birth,
                contact,
                department,
                profile_photo,
            };
            yield (0, Patient_1.addNewPatient)(newPatientPayload);
            res.status(201).json({ message: "Patient Admission added successfully" });
        }
        const newPatientAdmissionPayload = {
            student_id,
            cases,
            vitalSigns,
            actions,
            common_reasons,
            reasons,
            prescription,
            nurseNotes,
            emasOnDuty,
            timestamp,
        };
        // create new patient admission record
        yield (0, PatientAdmission_1.addNewPatientAdmission)(newPatientAdmissionPayload);
        res.status(201).json({ message: "Patient Admission added successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Error creating new admission", error: error.message });
        }
        else {
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.addPatientAdmission = addPatientAdmission;
const editPatientAdmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //check student if exist
        const studentExist = yield (0, Patient_1.studentExists)(req.body.student_id);
        if (!studentExist) {
            return res.status(400).json({ message: "ID not exist." });
        }
        const { row_id, student_id, cases, vital_signs, actions, common_reasons, reasons, prescription, nurse_notes, emasOnDuty, timestamp, } = req.body;
        const updatePatientAdmissionPayload = {
            student_id,
            cases,
            vitalSigns: vital_signs,
            actions,
            common_reasons,
            reasons,
            prescription,
            nurseNotes: nurse_notes,
            emasOnDuty,
            timestamp,
        };
        // update patient admission record
        yield (0, PatientAdmission_1.updatePatientAdmission)(row_id, updatePatientAdmissionPayload);
        res.status(201).json({ message: "Patient Admission update successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Error updating admission", error: error.message });
        }
        else {
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.editPatientAdmission = editPatientAdmission;
const newEditPatientAdmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //check student if exist
        const studentExist = yield (0, Patient_1.studentExists)(req.body.student_id);
        if (!studentExist) {
            return res.status(400).json({ message: "ID not exist." });
        }
        const { row_id, student_id, nurse_notes, emasOnDuty, timestamp, temperature, pulse_rate, respiratory_rate, blood_pressure, oxygen_saturation, pain_scale, } = req.body;
        const updatePatientAdmissionPayload = {
            student_id,
            temperature,
            pulse_rate,
            respiratory_rate,
            blood_pressure,
            oxygen_saturation,
            pain_scale,
            nurseNotes: nurse_notes,
            emasOnDuty,
            timestamp,
        };
        // update patient admission record
        yield (0, PatientAdmission_1.newUpdatePatientAdmission)(row_id, updatePatientAdmissionPayload);
        res.status(201).json({ message: "Patient Admission update successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Error updating admission", error: error.message });
        }
        else {
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.newEditPatientAdmission = newEditPatientAdmission;
const getPatientAdmissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patientAdmission = yield (0, PatientAdmission_1.getAllPatientAdmissions)();
        return res.status(200).json(patientAdmission);
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
exports.getPatientAdmissions = getPatientAdmissions;
const getPatientAdmiById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const patientAdmission = yield (0, PatientAdmission_1.getPatientAdmissionById)(id);
        return res.status(200).json(patientAdmission);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Error fetching patient", error: error.message });
        }
        else {
            return res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.getPatientAdmiById = getPatientAdmiById;
const deletePatientAdmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield (0, PatientAdmission_1.deletePatientAdmissionById)(id);
        res.status(200).json({ message: "PatientAdmission deleted successfully" });
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
exports.deletePatientAdmission = deletePatientAdmission;
