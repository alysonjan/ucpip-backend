"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoctors = exports.removeDoctor = exports.updateDoctor = exports.createNewDoctor = exports.checkDoctorIfExist = void 0;
const database_1 = __importDefault(require("../config/database"));
const checkDoctorIfExist = (prc_license) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield database_1.default.query("SELECT * FROM doctors WHERE prc_license = ?", [prc_license]);
    return rows.length > 0;
});
exports.checkDoctorIfExist = checkDoctorIfExist;
const createNewDoctor = (doctor) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.query("INSERT INTO doctors (fullname, prc_license, signature, created_at) VALUES (?,?,?,?)", [
            doctor.fullname,
            doctor.prc_license,
            doctor.signature,
            new Date(),
        ]);
    }
    catch (error) {
        console.error("Error adding new doctor:", error);
        throw new Error("Failed to add a new doctor");
    }
});
exports.createNewDoctor = createNewDoctor;
const updateDoctor = (doctor) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.query("UPDATE doctors SET fullname = ?, prc_license = ?, created_at = ? WHERE id = ?", [
            doctor.fullname,
            doctor.prc_license,
            new Date(),
            doctor.id,
        ]);
    }
    catch (error) {
        console.error("Error updating doctor:", error);
        throw new Error("Failed to update doctor");
    }
});
exports.updateDoctor = updateDoctor;
const removeDoctor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.query("DELETE FROM doctors WHERE prc_license = ?", [id]);
    }
    catch (error) {
        console.error("Error deleting doctors:", error);
        throw new Error("Failed to delete doctors");
    }
});
exports.removeDoctor = removeDoctor;
const getDoctors = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.default.query("SELECT * FROM doctors ORDER BY fullname");
        return rows;
    }
    catch (error) {
        throw error;
    }
});
exports.getDoctors = getDoctors;
