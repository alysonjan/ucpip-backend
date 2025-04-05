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
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctors = exports.deleteDoctor = exports.saveDoctor = void 0;
const Doctors_1 = require("../models/Doctors");
// export const saveDoctor = async (req: Request, res: Response) => {
const saveDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { action, fullname, prc_license, id } = req.body;
        if (action === "edit") {
            const doctorpayloadUpdate = {
                id,
                fullname,
                prc_license,
            };
            yield (0, Doctors_1.updateDoctor)(doctorpayloadUpdate);
            return res.status(200).json({ message: "Doctor update successfully" });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Signature is required" });
        }
        // if (!(req as Express.Request & { file?: Express.Multer.File }).file) {
        //   return res.status(400).json({ message: "Signature is required" });
        // }
        // Get file path or filename from Multer (this is the signature)
        const signature = req.file.filename; // or req.file.paths
        const doctorpayload = {
            id,
            fullname,
            prc_license,
            signature,
        };
        const isDoctorExist = yield (0, Doctors_1.checkDoctorIfExist)(prc_license);
        if (isDoctorExist) {
            return res.status(400).json({ message: "Doctor already exist" });
        }
        yield (0, Doctors_1.createNewDoctor)(doctorpayload);
        return res.status(201).json({ message: "Doctor added successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Something went wrong", error: error.message });
        }
        else {
            return res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.saveDoctor = saveDoctor;
const deleteDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        yield (0, Doctors_1.removeDoctor)(id);
        return res.status(200).json({ message: "successfully deleted" });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Something went wrong", error: error.message });
        }
        else {
            return res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.deleteDoctor = deleteDoctor;
const doctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docs = yield (0, Doctors_1.getDoctors)();
        return res.status(200).json(docs);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Error fetching Doctors", error: error.message });
        }
        else {
            return res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.doctors = doctors;
