"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const patientController_1 = require("../controllers/patientController");
const auth_1 = require("../middlewares/auth");
// import { validateSchema } from '../middlewares/validation';
// import { patientSchema } from '../validation/PatientSchema';
exports.default = (router) => {
    router.get("/patients", auth_1.authenticateToken, patientController_1.getPatients);
    router.get("/patient/:student_id", auth_1.authenticateToken, patientController_1.getPatientByStudentId);
    router.get("/patient-clinic-visit-log/:student_id", auth_1.authenticateToken, patientController_1.getPatientClinicVisitLog);
    router.post("/patient/save", auth_1.authenticateToken, patientController_1.savePatient);
    router.post("/patient/delete/:student_id", auth_1.authenticateToken, patientController_1.deletePatient);
    //student portal
    router.post("/student-record/:student_id", patientController_1.studentRecords);
    return router;
};
