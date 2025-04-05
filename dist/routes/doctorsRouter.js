"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middlewares/auth");
const doctorsController_1 = require("../controllers/doctorsController");
const upload_1 = require("../services/upload");
exports.default = (router) => {
    // Use Multer to handle the file upload and authenticateToken middleware for authentication
    router.post("/save-doctor", auth_1.authenticateToken, upload_1.upload.single("signature"), doctorsController_1.saveDoctor);
    router.get("/doctors", auth_1.authenticateToken, doctorsController_1.doctors);
    router.post("/delete-doctor", auth_1.authenticateToken, doctorsController_1.deleteDoctor);
    return router;
};
