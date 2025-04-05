import { Router } from "express";
import {
  savePatient,
  getPatients,
  getPatientByStudentId,
  deletePatient,
  getPatientClinicVisitLog,
  studentRecords,
} from "../controllers/patientController";
import { authenticateToken } from "../middlewares/auth";
// import { validateSchema } from '../middlewares/validation';
// import { patientSchema } from '../validation/PatientSchema';

export default (router: Router) => {
  router.get("/patients", authenticateToken, getPatients);
  router.get("/patient/:student_id", authenticateToken, getPatientByStudentId);
  router.get("/patient-clinic-visit-log/:student_id", authenticateToken, getPatientClinicVisitLog);
  router.post("/patient/save", authenticateToken, savePatient);
  router.post("/patient/delete/:student_id", authenticateToken, deletePatient);

  //student portal
  router.post("/student-record/:student_id", studentRecords);

  return router;
};
