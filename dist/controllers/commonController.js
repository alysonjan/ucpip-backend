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
exports.yearlyReport = exports.deleteChiefComplaint = exports.saveChiefComplaint = exports.getChiefComplaint = exports.dashboardController = exports.departments = exports.deleteDepartment = exports.saveDepartment = void 0;
const Common_1 = require("../models/Common");
const path_1 = __importDefault(require("path"));
const report_1 = require("../services/report");
const saveDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { action, name, id } = req.body;
        const isDeparmentExist = yield (0, Common_1.checkDepartmentIfExist)(name);
        if (isDeparmentExist) {
            return res.status(400).json({ message: "Department already exist" });
        }
        if (action === "edit") {
            yield (0, Common_1.updateDepartment)(id, name);
            return res.status(200).json({ message: "Department update successfully" });
        }
        yield (0, Common_1.createNewDepartment)(name);
        return res.status(201).json({ message: "Department added successfully" });
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
exports.saveDepartment = saveDepartment;
const deleteDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        yield (0, Common_1.removeDepartment)(id);
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
exports.deleteDepartment = deleteDepartment;
const departments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield (0, Common_1.getDepartment)();
        return res.status(200).json(patients);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Error fetching department", error: error.message });
        }
        else {
            return res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.departments = departments;
const dashboardController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const overall_visit = yield (0, Common_1.overall_visits)();
        const overall_patient = yield (0, Common_1.overall_patients)();
        const patient_per_month = yield (0, Common_1.patients_per_month)();
        const patient_per_day_of_week = yield (0, Common_1.patients_per_day_of_week)();
        const top10_days_with_most_patient = yield (0, Common_1.top10_days_with_most_patients)();
        const top10_common_reason = yield (0, Common_1.top10_common_reasons)();
        const consultation_per_monthly = yield (0, Common_1.consultation_per_month)();
        const consultation_per_day_week = yield (0, Common_1.consultation_per_day_of_week)();
        // Create an object to hold all the results
        const results = {
            overall_visit,
            overall_patient,
            patient_per_month,
            patient_per_day_of_week,
            top10_days_with_most_patient,
            top10_common_reason,
            consultation_per_monthly,
            consultation_per_day_week,
        };
        // Return the results as a JSON response
        return res.json(results);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
        }
        else {
            return res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.dashboardController = dashboardController;
const getChiefComplaint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield (0, Common_1.chiefComplaint)();
        return res.status(200).json(patients);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Error fetching chief complaint", error: error.message });
        }
        else {
            return res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
});
exports.getChiefComplaint = getChiefComplaint;
const saveChiefComplaint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { action, name, id } = req.body;
        const isChiefComplaintIfExist = yield (0, Common_1.checkChiefComplaintIfExist)(name);
        if (isChiefComplaintIfExist) {
            return res.status(400).json({ message: "ChiefComplaint already exist" });
        }
        if (action === "edit") {
            yield (0, Common_1.updateChiefComplaint)(id, name);
            return res.status(200).json({ message: "ChiefComplaint update successfully" });
        }
        yield (0, Common_1.createChiefComplaint)(name);
        return res.status(201).json({ message: "ChiefComplaint added successfully" });
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
exports.saveChiefComplaint = saveChiefComplaint;
const deleteChiefComplaint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        yield (0, Common_1.removeChiefComplaint)(id);
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
exports.deleteChiefComplaint = deleteChiefComplaint;
// export const yearlyReport = async (req: Request, res: Response) => {
//   try {
//     let outputDirectory = "";
//     let outputFilePath = "";
//     const date = new Date(req.body.date); // Convert to Date object
//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const monthAndYear = `${monthNames[date.getMonth()]}-${date.getFullYear()}`;
//     const year = date.getFullYear().toString();
//     const clinicName = "SWU PHINMA UNIVERSITY CLINIC";
//     const reportPeriod = date.getFullYear();
//     const serviceOffered = (await getServiceOfferedByYear(year)) ?? "No Data";
//     const totalPatientsServed = (await getTotalPatientsServedByYear(year)) ?? "No Data";
//     const physicalExamPatients = (await getTotalPhysicalExamsByYear(year)) ?? "No Data";
//     const vaccinationPatients = (await getTotalVaccinationByYear(year)) ?? "No Data";
//     const healthConcernConsultations = (await getTotalHealthConcernByYear(year)) ?? "No Data";
//     const newPatients = (await getTotalNewPatientsByYear(year)) ?? "No Data";
//     const returningPatients = (await getTotalReturningPatientsByYear(year)) ?? "No Data";
//     // skip age disttribution
//     const genderDistributionMale = (await getTotalMalePatientsByYear(year)) ?? "No Data";
//     const genderDistributionFemale = (await getTotalFemalePatientsByYear(year)) ?? "No Data";
//     const department = (await getTotalPatientsByDepartment(year)) ?? "No Data";
//     const totalConsultations = (await getTotalConsultationsServedByYear(year)) ?? "No Data";
//     const commonDiagnosis = (await getCommonDiagnosis(year)) ?? "No Data";
//     const totalVaccinationsAdministered = (await getTotalVaccinationByYear(year)) ?? "No Data";
//     // SKIP Types of Vaccines Given
//     const monthlyPatientDistribution = (await getMonthlyPatientDistribution(year)) ?? "No Data";
//     const payload = {
//       monthAndYear: monthAndYear,
//       clinicName: clinicName,
//       reportPeriod: reportPeriod,
//       serviceOffered: serviceOffered,
//       totalPatientsServed: totalPatientsServed,
//       physicalExamPatients: physicalExamPatients,
//       vaccinationPatients: vaccinationPatients,
//       healthConcernConsultations: healthConcernConsultations,
//       newPatients: newPatients,
//       returningPatients: returningPatients,
//       genderDistributionMale: genderDistributionMale,
//       genderDistributionFemale: genderDistributionFemale,
//       department: department,
//       totalConsultations: totalConsultations,
//       commonDiagnosis: commonDiagnosis,
//       totalVaccinationsAdministered: totalVaccinationsAdministered,
//       monthlyPatientDistribution: monthlyPatientDistribution,
//     };
//     outputDirectory = path.join(__dirname, `../../public/generatedPdf`);
//     outputFilePath = path.join(outputDirectory, `generated_${year}-yearly-report.pdf`);
//     if (!fs.existsSync(outputDirectory)) {
//       return res.status(500).json({ message: "Output directory does not exist" });
//     }
//     await buildPDFDocsForYearlyReport(payload, outputFilePath);
//     // return res
//     //   .status(200)
//     //   .json([
//     //     monthAndYear,
//     //     clininName,
//     //     reportPeriod,
//     //     serviceOffered,
//     //     totalPatientsServed,
//     //     physicalExamPatients,
//     //     vaccinationPatients,
//     //     healthConcernConsultations,
//     //     newPatients,
//     //     returningPatients,
//     //     genderDistributionMale,
//     //     genderDistributionFemale,
//     //     department,
//     //     totalConsultations,
//     //     commonDiagnosis,
//     //     totalVaccinationsAdministered,
//     //     monthlyPatientDistribution,
//     //   ]);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       return res.status(500).json({ message: "Error fetching yearly report", error: error.message });
//     } else {
//       return res.status(500).json({ message: "An unexpected error occurred" });
//     }
//   }
// };
const yearlyReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Convert to Date object and extract Month-Year format
        const date = new Date(req.body.date);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthAndYear = `${monthNames[date.getMonth()]}-${date.getFullYear()}`;
        const year = date.getFullYear().toString();
        // Define constants
        const clinicName = "SWU PHINMA UNIVERSITY CLINIC";
        const reportPeriod = date.getFullYear().toString();
        // Fetch data in parallel
        const [serviceOffered, totalPatientsServed, physicalExamPatients, vaccinationPatients, healthConcernConsultations, newPatients, returningPatients, genderDistributionMale, genderDistributionFemale, department, totalConsultations, commonDiagnosis, totalVaccinationsAdministered, monthlyPatientDistribution,] = yield Promise.all([
            (0, Common_1.getServiceOfferedByYear)(year),
            (0, Common_1.getTotalPatientsServedByYear)(year),
            (0, Common_1.getTotalPhysicalExamsByYear)(year),
            (0, Common_1.getTotalVaccinationByYear)(year),
            (0, Common_1.getTotalHealthConcernByYear)(year),
            (0, Common_1.getTotalNewPatientsByYear)(year),
            (0, Common_1.getTotalReturningPatientsByYear)(year),
            (0, Common_1.getTotalMalePatientsByYear)(year),
            (0, Common_1.getTotalFemalePatientsByYear)(year),
            (0, Common_1.getTotalPatientsByDepartment)(year),
            (0, Common_1.getTotalConsultationsServedByYear)(year),
            (0, Common_1.getCommonDiagnosis)(year),
            (0, Common_1.getTotalVaccinationByYear)(year),
            (0, Common_1.getMonthlyPatientDistribution)(year),
        ]);
        // Construct payload
        const payload = {
            monthAndYear,
            clinicName,
            reportPeriod: reportPeriod !== null && reportPeriod !== void 0 ? reportPeriod : "No Data",
            serviceOffered: serviceOffered,
            totalPatientsServed: totalPatientsServed !== null && totalPatientsServed !== void 0 ? totalPatientsServed : "No Data",
            physicalExamPatients: physicalExamPatients !== null && physicalExamPatients !== void 0 ? physicalExamPatients : "No Data",
            vaccinationPatients: vaccinationPatients !== null && vaccinationPatients !== void 0 ? vaccinationPatients : "No Data",
            healthConcernConsultations: healthConcernConsultations !== null && healthConcernConsultations !== void 0 ? healthConcernConsultations : "No Data",
            newPatients: newPatients !== null && newPatients !== void 0 ? newPatients : "No Data",
            returningPatients: returningPatients !== null && returningPatients !== void 0 ? returningPatients : "No Data",
            genderDistributionMale: genderDistributionMale !== null && genderDistributionMale !== void 0 ? genderDistributionMale : "No Data",
            genderDistributionFemale: genderDistributionFemale !== null && genderDistributionFemale !== void 0 ? genderDistributionFemale : "No Data",
            department: department !== null && department !== void 0 ? department : "No Data",
            totalConsultations: totalConsultations !== null && totalConsultations !== void 0 ? totalConsultations : "No Data",
            commonDiagnosis: commonDiagnosis !== null && commonDiagnosis !== void 0 ? commonDiagnosis : "No Data",
            totalVaccinationsAdministered: totalVaccinationsAdministered !== null && totalVaccinationsAdministered !== void 0 ? totalVaccinationsAdministered : "No Data",
            monthlyPatientDistribution: monthlyPatientDistribution !== null && monthlyPatientDistribution !== void 0 ? monthlyPatientDistribution : "No Data",
        };
        // Set output paths
        const outputDirectory = path_1.default.join(__dirname, "../../public/generatedPdf");
        const outputFilePath = path_1.default.join(outputDirectory, `generated_${year}-yearly-report.pdf`);
        // Generate PDF asynchronously
        yield (0, report_1.buildPDFDocsForYearlyReport)(payload, outputFilePath);
        // Send the PDF file back in the response
        if (outputFilePath === "") {
            res.status(400).json({ message: "file path error", error: "error" });
        }
        else {
            res.download(outputFilePath, `generated_${year}-yearly-report.pdf`, (err) => {
                if (err) {
                    console.error("Error sending PDF:", err);
                    res.status(500).send("Error sending PDF file");
                }
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Error fetching yearly report", error: error.message });
        }
        return res.status(500).json({ message: "An unexpected error occurred" });
    }
});
exports.yearlyReport = yearlyReport;
