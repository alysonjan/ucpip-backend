import { Request, Response } from "express";
import {
  checkDepartmentIfExist,
  consultation_per_day_of_week,
  consultation_per_month,
  createNewDepartment,
  getDepartment,
  overall_patients,
  overall_visits,
  patients_per_day_of_week,
  patients_per_month,
  removeDepartment,
  top10_common_reasons,
  top10_days_with_most_patients,
  updateDepartment,
  chiefComplaint,
  checkChiefComplaintIfExist,
  updateChiefComplaint,
  createChiefComplaint,
  removeChiefComplaint,
  getServiceOfferedByYear,
  getTotalPatientsServedByYear,
  getTotalPhysicalExamsByYear,
  getTotalVaccinationByYear,
  getTotalHealthConcernByYear,
  getTotalNewPatientsByYear,
  getTotalReturningPatientsByYear,
  getTotalMalePatientsByYear,
  getTotalFemalePatientsByYear,
  getTotalPatientsByDepartment,
  getTotalConsultationsServedByYear,
  getCommonDiagnosis,
  getMonthlyPatientDistribution,
} from "../models/Common";
import path from "path";
import fs from "fs";
import { buildPDFDocsForYearlyReport } from "../services/report";

export const saveDepartment = async (req: Request, res: Response) => {
  try {
    const { action, name, id } = req.body;
    const isDeparmentExist = await checkDepartmentIfExist(name);

    if (isDeparmentExist) {
      return res.status(400).json({ message: "Department already exist" });
    }

    if (action === "edit") {
      await updateDepartment(id, name);
      return res.status(200).json({ message: "Department update successfully" });
    }
    await createNewDepartment(name);
    return res.status(201).json({ message: "Department added successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Something went wrong", error: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    await removeDepartment(id);
    return res.status(200).json({ message: "successfully deleted" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Something went wrong", error: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const departments = async (req: Request, res: Response) => {
  try {
    const patients = await getDepartment();

    return res.status(200).json(patients);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Error fetching department", error: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const dashboardController = async (req: Request, res: Response) => {
  try {
    const overall_visit = await overall_visits();
    const overall_patient = await overall_patients();
    const patient_per_month = await patients_per_month();
    const patient_per_day_of_week = await patients_per_day_of_week();
    const top10_days_with_most_patient = await top10_days_with_most_patients();
    const top10_common_reason = await top10_common_reasons();

    const consultation_per_monthly = await consultation_per_month();
    const consultation_per_day_week = await consultation_per_day_of_week();

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const getChiefComplaint = async (req: Request, res: Response) => {
  try {
    const patients = await chiefComplaint();

    return res.status(200).json(patients);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Error fetching chief complaint", error: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const saveChiefComplaint = async (req: Request, res: Response) => {
  try {
    const { action, name, id } = req.body;
    const isChiefComplaintIfExist = await checkChiefComplaintIfExist(name);

    if (isChiefComplaintIfExist) {
      return res.status(400).json({ message: "ChiefComplaint already exist" });
    }

    if (action === "edit") {
      await updateChiefComplaint(id, name);
      return res.status(200).json({ message: "ChiefComplaint update successfully" });
    }

    await createChiefComplaint(name);
    return res.status(201).json({ message: "ChiefComplaint added successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Something went wrong", error: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const deleteChiefComplaint = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    await removeChiefComplaint(id);
    return res.status(200).json({ message: "successfully deleted" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Something went wrong", error: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

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

export const yearlyReport = async (req: Request, res: Response) => {
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
    const [
      serviceOffered,
      totalPatientsServed,
      physicalExamPatients,
      vaccinationPatients,
      healthConcernConsultations,
      newPatients,
      returningPatients,
      genderDistributionMale,
      genderDistributionFemale,
      department,
      totalConsultations,
      commonDiagnosis,
      totalVaccinationsAdministered,
      monthlyPatientDistribution,
    ] = await Promise.all([
      getServiceOfferedByYear(year),
      getTotalPatientsServedByYear(year),
      getTotalPhysicalExamsByYear(year),
      getTotalVaccinationByYear(year),
      getTotalHealthConcernByYear(year),
      getTotalNewPatientsByYear(year),
      getTotalReturningPatientsByYear(year),
      getTotalMalePatientsByYear(year),
      getTotalFemalePatientsByYear(year),
      getTotalPatientsByDepartment(year),
      getTotalConsultationsServedByYear(year),
      getCommonDiagnosis(year),
      getTotalVaccinationByYear(year),
      getMonthlyPatientDistribution(year),
    ]);

    // Construct payload
    const payload = {
      monthAndYear,
      clinicName,
      reportPeriod: reportPeriod ?? "No Data",
      serviceOffered: serviceOffered,
      totalPatientsServed: totalPatientsServed ?? "No Data",
      physicalExamPatients: physicalExamPatients ?? "No Data",
      vaccinationPatients: vaccinationPatients ?? "No Data",
      healthConcernConsultations: healthConcernConsultations ?? "No Data",
      newPatients: newPatients ?? "No Data",
      returningPatients: returningPatients ?? "No Data",
      genderDistributionMale: genderDistributionMale ?? "No Data",
      genderDistributionFemale: genderDistributionFemale ?? "No Data",
      department: department ?? "No Data",
      totalConsultations: totalConsultations ?? "No Data",
      commonDiagnosis: commonDiagnosis ?? "No Data",
      totalVaccinationsAdministered: totalVaccinationsAdministered ?? "No Data",
      monthlyPatientDistribution: monthlyPatientDistribution ?? "No Data",
    };

    // Set output paths
    const outputDirectory = path.join(__dirname, "../../public/generatedPdf");
    const outputFilePath = path.join(outputDirectory, `generated_${year}-yearly-report.pdf`);

    // Generate PDF asynchronously
    await buildPDFDocsForYearlyReport(payload, outputFilePath);

    // Send the PDF file back in the response
    if (outputFilePath === "") {
      res.status(400).json({ message: "file path error", error: "error" });
    } else {
      res.download(outputFilePath, `generated_${year}-yearly-report.pdf`, (err) => {
        if (err) {
          console.error("Error sending PDF:", err);
          res.status(500).send("Error sending PDF file");
        }
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Error fetching yearly report", error: error.message });
    }
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};
