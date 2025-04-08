"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const PatientAdmissionSchema_1 = require("../validation/PatientAdmissionSchema");
const patientAdmissionController_1 = require("../controllers/patientAdmissionController");
exports.default = (router) => {
    router.post("/patient-admission/add", auth_1.authenticateToken, (0, validation_1.validateSchema)(PatientAdmissionSchema_1.patientAdmissionSchema), patientAdmissionController_1.addPatientAdmission);
    router.post("/patient-admission/edit", auth_1.authenticateToken, (0, validation_1.validateSchema)(PatientAdmissionSchema_1.editPatientAdmissionSchema), patientAdmissionController_1.editPatientAdmission);
    router.get("/patient-admissions", auth_1.authenticateToken, patientAdmissionController_1.getPatientAdmissions);
    router.get("/patient-admission/:id", auth_1.authenticateToken, patientAdmissionController_1.getPatientAdmiById);
    router.post("/patient-admission/delete/:id", auth_1.authenticateToken, patientAdmissionController_1.deletePatientAdmission);
    // NEW ROUTESSSSSS
    router.post("/patient-admission/new-consultation", auth_1.authenticateToken, patientAdmissionController_1.newConsultation);
    router.post("/patient-admission/newedit", auth_1.authenticateToken, patientAdmissionController_1.newEditPatientAdmission);
    return router; // Return the router with the attached routes
};
