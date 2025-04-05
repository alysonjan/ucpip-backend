import Joi from 'joi';

export const patientSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  student_id: Joi.string().alphanum().min(1).max(20).required(),
  sex: Joi.string().valid('male', 'female').required(),
  address: Joi.string().min(1).max(200).required(),
  date_of_birth: Joi.date().iso().required(), // ISO 8601 format
  contact: Joi.string().pattern(/^[0-9+\-\s()]{10,20}$/).required(),
  department: Joi.string().min(1).max(100).required(),
  height: Joi.string().optional().allow(null), // Nullable
  weight: Joi.string().optional().allow(null), // Nullable
  bmi: Joi.string().optional().allow(null), // Nullable
  bmi_category: Joi.string().optional().allow(null), // Nullable
  existing_medical_condition: Joi.string().optional().allow(null), // Nullable
  maintenance_medication: Joi.string().optional().allow(null), // Nullable
  allergies: Joi.string().optional().allow(null), // Nullable
  vaccination_link: Joi.string().optional().allow(null), // Nullable
  family_hx_of_illness: Joi.string().optional().allow(null), // Nullable
  smoking: Joi.string().optional().allow(null), // Nullable
  drinking: Joi.string().optional().allow(null), // Nullable
  health_insurance: Joi.string().optional().allow(null), // Nullable
  patient_category: Joi.string().optional().allow(null), // Nullable
  blood_type: Joi.string().optional().allow(null), // Nullable
  action: Joi.string().optional().allow(null), // Nullable
  profile_photo: Joi.string().optional().allow(null) // Nullable
});


