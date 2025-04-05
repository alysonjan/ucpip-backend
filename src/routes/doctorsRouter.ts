import { Router } from "express";
import { authenticateToken } from "../middlewares/auth";
import { deleteDoctor, doctors, saveDoctor } from "../controllers/doctorsController";
import { upload } from "../services/upload";

export default (router: Router) => {
  // Use Multer to handle the file upload and authenticateToken middleware for authentication
  router.post("/save-doctor", authenticateToken, upload.single("signature"), saveDoctor);

  router.get("/doctors", authenticateToken, doctors);
  router.post("/delete-doctor", authenticateToken, deleteDoctor);

  return router;
};
