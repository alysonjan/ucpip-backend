"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middlewares/auth");
const documentController_1 = require("../controllers/documentController");
exports.default = (router) => {
    router.post('/print-document', auth_1.authenticateToken, documentController_1.printDocs);
    return router;
};
