import { Router } from "express";
import { authenticateToken } from "../middlewares/auth";
import {
  saveDepartment,
  dashboardController,
  departments,
  deleteDepartment,
  getChiefComplaint,
  saveChiefComplaint,
  deleteChiefComplaint,
  yearlyReport,
} from "../controllers/commonController";

export default (router: Router) => {
  router.get("/departments", authenticateToken, departments);
  router.post("/save-department", authenticateToken, saveDepartment);
  router.post("/delete-department", authenticateToken, deleteDepartment);

  router.get("/dashboard", authenticateToken, dashboardController);

  router.get("/chief-complaints", authenticateToken, getChiefComplaint);
  router.post("/save-chief-complaints", authenticateToken, saveChiefComplaint);
  router.post("/delete-chief-complaints", authenticateToken, deleteChiefComplaint);

  router.post("/yearly-report", authenticateToken, yearlyReport);

  return router;
};
