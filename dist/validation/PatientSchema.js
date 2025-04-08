"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.patientSchema = joi_1.default.object({
    first_name: joi_1.default.string().required(),
    last_name: joi_1.default.string().min(1).max(100).required(),
    email: joi_1.default.string().email().required(),
    student_id: joi_1.default.string().alphanum().min(1).max(20).required(),
    sex: joi_1.default.string().valid('male', 'female').required(),
    address: joi_1.default.string().min(1).max(200).required(),
    date_of_birth: joi_1.default.date().iso().required(), // ISO 8601 format
    contact: joi_1.default.string().pattern(/^[0-9+\-\s()]{10,20}$/).required(),
    department: joi_1.default.string().min(1).max(100).required(),
    height: joi_1.default.string().optional().allow(null), // Nullable
    weight: joi_1.default.string().optional().allow(null), // Nullable
    bmi: joi_1.default.string().optional().allow(null), // Nullable
    bmi_category: joi_1.default.string().optional().allow(null), // Nullable
    existing_medical_condition: joi_1.default.string().optional().allow(null), // Nullable
    maintenance_medication: joi_1.default.string().optional().allow(null), // Nullable
    allergies: joi_1.default.string().optional().allow(null), // Nullable
    vaccination_link: joi_1.default.string().optional().allow(null), // Nullable
    family_hx_of_illness: joi_1.default.string().optional().allow(null), // Nullable
    smoking: joi_1.default.string().optional().allow(null), // Nullable
    drinking: joi_1.default.string().optional().allow(null), // Nullable
    health_insurance: joi_1.default.string().optional().allow(null), // Nullable
    patient_category: joi_1.default.string().optional().allow(null), // Nullable
    blood_type: joi_1.default.string().optional().allow(null), // Nullable
    action: joi_1.default.string().optional().allow(null), // Nullable
    profile_photo: joi_1.default.string().optional().allow(null) // Nullable
});
