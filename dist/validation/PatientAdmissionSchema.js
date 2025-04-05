"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPatientAdmissionSchema = exports.patientAdmissionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.patientAdmissionSchema = joi_1.default.object({
    first_name: joi_1.default.string().min(1).max(100).required(),
    last_name: joi_1.default.string().min(1).max(100).required(),
    email: joi_1.default.string().email().required(),
    student_id: joi_1.default.string().alphanum().min(1).max(20).required(),
    sex: joi_1.default.string().valid('male', 'female').required(),
    address: joi_1.default.string().min(1).max(200).required(),
    date_of_birth: joi_1.default.date().iso().required(), // Validates ISO 8601 date format
    contact: joi_1.default.string().required(), // Validates a 10-digit phone number
    department: joi_1.default.string().min(1).max(10).required(),
    profile_photo: joi_1.default.string().min(1).max(255).required(), // Assuming it's a filename
    cases: joi_1.default.string().min(1).max(200).required(),
    vitalSigns: joi_1.default.string().min(1).max(200).required(),
    actions: joi_1.default.string().min(1).max(500).required(),
    common_reasons: joi_1.default.string().min(1).max(500).required(),
    reasons: joi_1.default.string().allow(''),
    prescription: joi_1.default.string().min(1).max(500).required(),
    nurseNotes: joi_1.default.string().allow('').max(1000), // Optional field
    emasOnDuty: joi_1.default.string().min(1).max(100).required(),
    timestamp: joi_1.default.string().required(), // Can be further restricted to ISO 8601 or custom format
});
exports.editPatientAdmissionSchema = joi_1.default.object({
    row_id: joi_1.default.string().required(),
    emasOnDuty: joi_1.default.string().min(1).max(100).required(),
    timestamp: joi_1.default.string().required(),
    student_id: joi_1.default.string().alphanum().min(1).max(20).required(),
    first_name: joi_1.default.string().min(1).max(100).required(),
    last_name: joi_1.default.string().min(1).max(100).required(),
    sex: joi_1.default.string().valid('male', 'female').required(),
    contact: joi_1.default.string().required(),
    email: joi_1.default.string().email(), // Optional email
    address: joi_1.default.string().allow(''), // Optional string
    date_of_birth: joi_1.default.date().iso().allow(''), // Optional date in ISO format
    department: joi_1.default.string().allow(''), // Optional string
    department_name: joi_1.default.string().allow(''), // Optional string
    cases: joi_1.default.string().allow(''), // Optional string
    actions: joi_1.default.string().allow(''), // Optional string
    common_reasons: joi_1.default.string().allow(''), // Optional string
    reasons: joi_1.default.string().allow(''), // Optional string
    prescription: joi_1.default.string().allow(''), // Optional string
    vital_signs: joi_1.default.string().allow(''), // Optional string
    nurse_notes: joi_1.default.string().allow('') // Optional string
});
