import { Request, Response } from "express";
import { addNewPatient, studentExists } from "../models/Patient";
import {
  addNewConsultationMedcert,
  addNewConsultationMedical,
  addNewConsultationPhysicalExam,
  addNewConsultationVaccination,
  addNewPatientAdmission,
  deletePatientAdmissionById,
  getAllPatientAdmissions,
  getPatientAdmissionById,
  newUpdatePatientAdmission,
  updatePatientAdmission,
} from "../models/PatientAdmission";

export const newConsultation = async (req: Request, res: Response) => {
  try {
    const {
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
      nurseNotes,
      emasOnDuty,
      timestamp,
      temperature,
      pulse_rate,
      respiratory_rate,
      blood_pressure,
      oxygen_saturation,
      pain_scale,
      // ########################################
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
      // ########################################

      status,
      physical_exam_remarks,
      // ########################################

      vaccination_given,
      dose_no,
      purpose,
      consultation_service,

      // ########################################
      medcert_data,
      medcert_remarks,
    } = req.body;

    //check student if exist
    const studentExist = await studentExists(student_id);

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

      await addNewPatient(newPatientPayload);

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
      await addNewConsultationMedical(newPatientAdmissionPayloadMedical);

      res.status(201).json({ message: "Success" });
    } else if (consultation_service === "med_certificate") {
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

      await addNewConsultationMedcert(newPatientAdmissionPayloadMedCert);

      res.status(201).json({ message: "Success" });
    } else if (consultation_service === "physical_exam") {
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

      await addNewConsultationPhysicalExam(newPatientAdmissionPayloadTrauma);

      res.status(201).json({ message: "Success" });
    } else if (consultation_service === "vaccination") {
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

      await addNewConsultationVaccination(newPatientAdmissionPayloadVaccination);

      res.status(201).json({ message: "Success" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error Consultation", error: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const addPatientAdmission = async (req: Request, res: Response) => {
  try {
    const {
      first_name, // Changed from firstname to first_name
      last_name, // Changed from lastname to last_name
      email,
      student_id, // Changed from studentID to student_id
      sex,
      address,
      date_of_birth, // Changed from dateOfBirth to date_of_birth
      contact,
      department,
      profile_photo, // Changed from profile_photo (already matches)
      cases,
      vitalSigns, // Changed from vitalSigns to vitalSigns (already matches)
      actions,
      common_reasons,
      reasons,
      prescription,
      nurseNotes, // Changed from nurseNotes (already matches)
      emasOnDuty, // Changed from emasOnDuty (already matches)
      timestamp, // Changed from timestamp (already matches)
    } = req.body;

    //check student if exist
    const studentExist = await studentExists(student_id);

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

      await addNewPatient(newPatientPayload);

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
    await addNewPatientAdmission(newPatientAdmissionPayload);

    res.status(201).json({ message: "Patient Admission added successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error creating new admission", error: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const editPatientAdmission = async (req: Request, res: Response) => {
  try {
    //check student if exist
    const studentExist = await studentExists(req.body.student_id);

    if (!studentExist) {
      return res.status(400).json({ message: "ID not exist." });
    }

    const {
      row_id,
      student_id,
      cases,
      vital_signs,
      actions,
      common_reasons,
      reasons,
      prescription,
      nurse_notes,
      emasOnDuty,
      timestamp,
    } = req.body;

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
    await updatePatientAdmission(row_id, updatePatientAdmissionPayload);

    res.status(201).json({ message: "Patient Admission update successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error updating admission", error: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const newEditPatientAdmission = async (req: Request, res: Response) => {
  try {
    //check student if exist
    const studentExist = await studentExists(req.body.student_id);

    if (!studentExist) {
      return res.status(400).json({ message: "ID not exist." });
    }

    const {
      row_id,
      student_id,
      nurse_notes,
      emasOnDuty,
      timestamp,
      temperature,
      pulse_rate,
      respiratory_rate,
      blood_pressure,
      oxygen_saturation,
      pain_scale,
    } = req.body;

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
    await newUpdatePatientAdmission(row_id, updatePatientAdmissionPayload);

    res.status(201).json({ message: "Patient Admission update successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error updating admission", error: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const getPatientAdmissions = async (req: Request, res: Response) => {
  try {
    const patientAdmission = await getAllPatientAdmissions();

    return res.status(200).json(patientAdmission);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Error fetching patients", error: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const getPatientAdmiById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const patientAdmission = await getPatientAdmissionById(id);

    return res.status(200).json(patientAdmission);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Error fetching patient", error: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const deletePatientAdmission = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    await deletePatientAdmissionById(id);
    res.status(200).json({ message: "PatientAdmission deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error creating new patient", error: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};
