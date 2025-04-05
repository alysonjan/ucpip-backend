import Joi from 'joi';

export const patientAdmissionSchema = Joi.object({
  first_name: Joi.string().min(1).max(100).required(),
  last_name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  student_id: Joi.string().alphanum().min(1).max(20).required(),
  sex: Joi.string().valid('male', 'female').required(),
  address: Joi.string().min(1).max(200).required(),
  date_of_birth: Joi.date().iso().required(), // Validates ISO 8601 date format
  contact: Joi.string().required(), // Validates a 10-digit phone number
  department: Joi.string().min(1).max(10).required(),
  profile_photo: Joi.string().min(1).max(255).required(), // Assuming it's a filename
  cases: Joi.string().min(1).max(200).required(),
  vitalSigns: Joi.string().min(1).max(200).required(),
  actions: Joi.string().min(1).max(500).required(),
  common_reasons: Joi.string().min(1).max(500).required(),
  reasons: Joi.string().allow(''),
  prescription: Joi.string().min(1).max(500).required(),
  nurseNotes: Joi.string().allow('').max(1000), // Optional field
  emasOnDuty: Joi.string().min(1).max(100).required(),
  timestamp: Joi.string().required(), // Can be further restricted to ISO 8601 or custom format
});


export const editPatientAdmissionSchema = Joi.object({
  row_id: Joi.string().required(),
  emasOnDuty: Joi.string().min(1).max(100).required(),
  timestamp: Joi.string().required(),
  student_id: Joi.string().alphanum().min(1).max(20).required(),
  first_name: Joi.string().min(1).max(100).required(),
  last_name: Joi.string().min(1).max(100).required(),
  sex: Joi.string().valid('male', 'female').required(),
  contact: Joi.string().required(),
  email: Joi.string().email(), // Optional email
  address: Joi.string().allow(''), // Optional string
  date_of_birth: Joi.date().iso().allow(''), // Optional date in ISO format
  department: Joi.string().allow(''), // Optional string
  department_name: Joi.string().allow(''), // Optional string
  cases: Joi.string().allow(''), // Optional string
  actions: Joi.string().allow(''), // Optional string
  common_reasons: Joi.string().allow(''), // Optional string
  reasons: Joi.string().allow(''), // Optional string
  prescription: Joi.string().allow(''), // Optional string
  vital_signs: Joi.string().allow(''), // Optional string
  nurse_notes: Joi.string().allow('') // Optional string
});