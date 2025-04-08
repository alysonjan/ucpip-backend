"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./userRouter"));
const patientRouter_1 = __importDefault(require("./patientRouter"));
const patientAdmissionRouter_1 = __importDefault(require("./patientAdmissionRouter"));
const commonRouter_1 = __importDefault(require("./commonRouter"));
const documentRouter_1 = __importDefault(require("./documentRouter"));
const doctorsRouter_1 = __importDefault(require("./doctorsRouter"));
const router = express_1.default.Router();
exports.default = () => {
    // Pass the initialized router to the userRouter function
    (0, userRouter_1.default)(router);
    (0, patientRouter_1.default)(router);
    (0, patientAdmissionRouter_1.default)(router);
    (0, commonRouter_1.default)(router);
    (0, documentRouter_1.default)(router);
    (0, doctorsRouter_1.default)(router);
    return router;
};
