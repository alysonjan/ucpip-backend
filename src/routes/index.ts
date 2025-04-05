import express from "express";
import userRouter from "./userRouter";
import patientRouter from "./patientRouter";
import patientAdmissionRouter from "./patientAdmissionRouter";
import commonRouter from "./commonRouter";
import documentRouter from "./documentRouter";
import doctorsRouter from "./doctorsRouter";

const router = express.Router();

export default (): express.Router => {
  // Pass the initialized router to the userRouter function
  userRouter(router);
  patientRouter(router);
  patientAdmissionRouter(router);
  commonRouter(router);
  documentRouter(router);
  doctorsRouter(router);

  return router;
};
