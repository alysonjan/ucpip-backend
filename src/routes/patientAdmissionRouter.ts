import { Router, Response } from "express";
import { authenticateToken } from "../middlewares/auth";
import { validateSchema } from "../middlewares/validation";
import { editPatientAdmissionSchema, patientAdmissionSchema } from "../validation/PatientAdmissionSchema";
import {
  addPatientAdmission,
  deletePatientAdmission,
  editPatientAdmission,
  getPatientAdmiById,
  getPatientAdmissions,
  newConsultation,
  newEditPatientAdmission,
} from "../controllers/patientAdmissionController";

export default (router: Router) => {
  router.post("/patient-admission/add", authenticateToken, validateSchema(patientAdmissionSchema), addPatientAdmission);
  router.post(
    "/patient-admission/edit",
    authenticateToken,
    validateSchema(editPatientAdmissionSchema),
    editPatientAdmission
  );
  router.get("/patient-admissions", authenticateToken, getPatientAdmissions);
  router.get("/patient-admission/:id", authenticateToken, getPatientAdmiById);
  router.post("/patient-admission/delete/:id", authenticateToken, deletePatientAdmission);

  // NEW ROUTESSSSSS
  router.post("/patient-admission/new-consultation", authenticateToken, newConsultation);
  router.post("/patient-admission/newedit", authenticateToken, newEditPatientAdmission);

  return router; // Return the router with the attached routes
};
