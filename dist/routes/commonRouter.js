"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middlewares/auth");
const commonController_1 = require("../controllers/commonController");
exports.default = (router) => {
    router.get("/departments", auth_1.authenticateToken, commonController_1.departments);
    router.post("/save-department", auth_1.authenticateToken, commonController_1.saveDepartment);
    router.post("/delete-department", auth_1.authenticateToken, commonController_1.deleteDepartment);
    router.get("/dashboard", auth_1.authenticateToken, commonController_1.dashboardController);
    router.get("/chief-complaints", auth_1.authenticateToken, commonController_1.getChiefComplaint);
    router.post("/save-chief-complaints", auth_1.authenticateToken, commonController_1.saveChiefComplaint);
    router.post("/delete-chief-complaints", auth_1.authenticateToken, commonController_1.deleteChiefComplaint);
    router.post("/yearly-report", auth_1.authenticateToken, commonController_1.yearlyReport);
    return router;
};
