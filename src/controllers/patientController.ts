import { json, Request, Response } from "express";
import {
  addBulkPatients,
  addNewPatient,
  checkstudentExistsBulk,
  deletePatientByID,
  getAllPatients,
  getPatientById,
  getPatientClinicVisitLogModel,
  getStudentRecords,
  studentExists,
  updatePatient,
} from "../models/Patient";

export const savePatient = async (req: Request, res: Response) => {
  try {
    if (req.body.action === "add_bulk") {
      try {
        // Extract all student IDs from the incoming bulk data
        const studentIds = req.body.data.map((patient: any) => patient.student_id);

        // Check if any of the students already exist
        const existingStudents = await checkstudentExistsBulk(studentIds);
        if (existingStudents.length > 0) {
          // Return the student IDs that already exist
          return res.status(400).json({
            message: `One or more students already exist: ${existingStudents.join(", ")}`,
            existingStudentIds: existingStudents,
          });
        }

        const payload = req.body.data.map((item: any) => ({
          ...item,
          profile_photo: "default-profile.png",
        }));

        // Proceed to insert new patients in bulk and get the count of rows added
        const rowsAdded = await addBulkPatients(payload);

        res.status(201).json({
          message: `${rowsAdded} Patients added successfully.`,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(500).json({ message: "Failed to add patients", error: error.message });
        } else {
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
      const studentExist = await studentExists(student_id);
      if (studentExist) {
        return res.status(400).json({ message: "Student already exist" });
      }

      //insert new patient
      await addNewPatient(req.body);

      res.status(201).json({ message: "Patient added successfully" });
    }

    if (action === "edit") {
      //check student if exist
      const studentExist = await studentExists(student_id);
      if (!studentExist) {
        return res.status(400).json({ message: "Student not exist" });
      }
      await updatePatient(req.body);
      res.status(200).json({ message: "Patient update successfully" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error creating new patient", error: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const studentID = req.params.student_id;

    const studentExist = await studentExists(studentID);
    if (!studentExist) {
      return res.status(400).json({ message: "Student not exist" });
    }
    await deletePatientByID(studentID);
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error creating new patient", error: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await getAllPatients();

    return res.status(200).json(patients);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Error fetching patients", error: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const getPatientByStudentId = async (req: Request, res: Response) => {
  const { student_id } = req.params; // Assuming student_id is passed as a route parameter

  try {
    const patients = await getPatientById(student_id);

    if (patients.length === 0) {
      return res.status(404).json({ message: "No patients found for this student ID" });
    }

    return res.status(200).json(patients);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Error fetching patients", error: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const getPatientClinicVisitLog = async (req: Request, res: Response) => {
  const { student_id } = req.params; // Assuming student_id is passed as a route parameter

  try {
    const patientsClinicVisitLogs = await getPatientClinicVisitLogModel(student_id);

    if (patientsClinicVisitLogs.length === 0) {
      // return res.status(404).json({ message: 'No patients history found for this student ID' });
      return res.status(200).json([]);
    }

    return res.status(200).json(patientsClinicVisitLogs);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Error fetching patients", error: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const studentRecords = async (req: Request, res: Response) => {
  const { student_id } = req.params; // Assuming student_id is passed as a route parameter

  try {
    const studzRecords = await getStudentRecords(student_id);

    if (studzRecords.length === 0) {
      return res.status(404).json({ message: "No student history found" });
    }

    return res.status(200).json(studzRecords);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Error fetching patients", error: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};
