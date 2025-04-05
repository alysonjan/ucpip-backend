import { Request, Response } from "express";
import {
  buildPDFDocsForClinicNote,
  buildPDFDocsForMedicalCertificate,
  buildPDFDocsForPhysicalExamForm,
  buildPDFDocsForReferralForm,
} from "../services/pdfService";
import path from "path";
import fs from "fs";
import { getMedicalCertificateRecord, getMedicalDoctor } from "../models/Documents";
import { calculateAge, generateUniquePeNo } from "../services/commonService";
import { getUserByStudentId } from "../models/User";
import { getPatientAdmissionByStudentId } from "../models/PatientAdmission";

// Your printMedCert function
export const printDocs = async (req: Request, res: Response) => {
  try {
    const { student_id, document_type, doctor_id } = req.body;

    // check user id first
    const isUserExists = await getUserByStudentId(student_id); // Await the promise to get the result

    if (!isUserExists) {
      return res.status(400).json({ message: "Student doesn't exist" });
    }

    //check if user have record in admission
    const hasStudentRecordInPatientAdmission = await getPatientAdmissionByStudentId(student_id); // Await the promise to get the result

    if (!hasStudentRecordInPatientAdmission) {
      return res.status(400).json({ message: "Student doesn't have any record" });
    }

    const datenow = new Date();

    const docTypes = {
      "physical-exam": "Physical Exam",
      "medical-certificate": "Medical Certificate",
      "clinic-note": "Clinical Note",
      "referral-form": "Referral Form",
    } as const;

    const matchingKey = Object.entries(docTypes).find(([, value]) => value === document_type)?.[0];

    if (!matchingKey) {
      return res.status(400).json({ message: "Invalid document type" });
    }

    let outputDirectory = "";
    let outputFilePath = "";

    if (matchingKey === "medical-certificate") {
      const medicalCertificateRecord = await getMedicalCertificateRecord(student_id);
      const doctorRecord = await getMedicalDoctor(doctor_id);

      const medicalCertificatePayload = {
        student_id: medicalCertificateRecord?.student_id || student_id,
        document_type: matchingKey,
        name: `${medicalCertificateRecord?.first_name} ${medicalCertificateRecord?.last_name}`,
        address: medicalCertificateRecord?.address || "N/A",
        date: datenow.toLocaleDateString(),
        age: medicalCertificateRecord?.date_of_birth
          ? calculateAge(medicalCertificateRecord.date_of_birth as string)
          : "N/A",
        sex: medicalCertificateRecord?.sex || "N/A",
        comment: medicalCertificateRecord?.chief_complaint || "N/A",
        status: medicalCertificateRecord?.medcert_data || "N/A",
        remarks: medicalCertificateRecord?.medcert_remarks || "N/A",

        // ****** doctor ******
        doctor_fullname: doctorRecord?.fullname || "N/A",
        doctor_signature: doctorRecord?.signature || "N/A",
        doctor_prc_license: doctorRecord?.prc_license || "N/A",
      };

      outputDirectory = path.join(__dirname, `../../public/generatedPdf`);
      outputFilePath = path.join(outputDirectory, `generated_${medicalCertificatePayload.student_id}.pdf`);

      if (!fs.existsSync(outputDirectory)) {
        return res.status(500).json({ message: "Output directory does not exist" });
      }

      await buildPDFDocsForMedicalCertificate(medicalCertificatePayload, outputFilePath);
    } else if (matchingKey === "clinic-note") {
      const clinicNoteRecord = await getMedicalCertificateRecord(student_id);
      const doctorRecord = await getMedicalDoctor(doctor_id);

      const clinicNotePayload = {
        student_id: clinicNoteRecord?.student_id || student_id,
        document_type: matchingKey,
        pe_no: generateUniquePeNo(),
        date: datenow.toLocaleDateString(),
        name: `${clinicNoteRecord?.first_name} ${clinicNoteRecord?.last_name}`,
        age: clinicNoteRecord?.date_of_birth ? calculateAge(clinicNoteRecord.date_of_birth as string) : "N/A",
        sex: clinicNoteRecord?.sex || "N/A",
        address: clinicNoteRecord?.address || "N/A",
        department: clinicNoteRecord?.department || "N/A",
        section: "Block 1",
        contact_number: clinicNoteRecord?.contact || "N/A",
        phinma_email: clinicNoteRecord?.email || "N/A",
        chief_complaint: clinicNoteRecord?.chief_complaint || "N/A",
        working_dx: clinicNoteRecord?.working_diagnosis || "N/A",
        blood_pressure: clinicNoteRecord?.blood_pressure || "N/A",
        pulse_rate: clinicNoteRecord?.pulse_rate || "N/A",
        respiratory: clinicNoteRecord?.respiratory_rate || "N/A",
        temperature: clinicNoteRecord?.temperature || "N/A",
        spO2: clinicNoteRecord?.oxygen_saturation || "N/A",
        signs_and_symptoms: clinicNoteRecord?.signs_and_symptoms || "N/A",
        allergies: clinicNoteRecord?.allergies || "N/A",
        medications: clinicNoteRecord?.prescription || "N/A",
        past_medical_history: clinicNoteRecord?.past_medical_history || "N/A",
        last_oral_intake: clinicNoteRecord?.medication || "N/A",
        event_loading_to_injury: clinicNoteRecord?.assessment || "N/A",
        management: clinicNoteRecord?.nurse_notes || "N/A",
        remarks: clinicNoteRecord?.actions || "N/A",

        // ****** doctor ******
        doctor_fullname: doctorRecord?.fullname || "N/A",
        doctor_signature: doctorRecord?.signature || "N/A",
        doctor_prc_license: doctorRecord?.prc_license || "N/A",
      };

      outputDirectory = path.join(__dirname, `../../public/generatedPdf`);
      outputFilePath = path.join(outputDirectory, `generated_${clinicNotePayload.student_id}.pdf`);

      if (!fs.existsSync(outputDirectory)) {
        return res.status(500).json({ message: "Output directory does not exist" });
      }

      await buildPDFDocsForClinicNote(clinicNotePayload, outputFilePath);
    } else if (matchingKey === "referral-form") {
      const referralRecord = await getMedicalCertificateRecord(student_id);
      const doctorRecord = await getMedicalDoctor(doctor_id);

      const referralFormPayload = {
        student_id: referralRecord?.student_id || student_id,
        document_type: matchingKey,
        pe_no: generateUniquePeNo(),
        date: datenow.toLocaleDateString(),
        name: `${referralRecord?.first_name} ${referralRecord?.last_name}`,
        age: referralRecord?.date_of_birth ? calculateAge(referralRecord.date_of_birth as string) : "N/A",
        sex: referralRecord?.sex || "N/A",
        address: referralRecord?.address || "N/A",
        department: referralRecord?.department || "N/A",
        section: "Block 1",
        contact_number: referralRecord?.contact || "N/A",
        phinma_email: referralRecord?.email || "N/A",
        chief_complaint: referralRecord?.chief_complaint || "N/A",
        working_dx: referralRecord?.working_diagnosis || "N/A",
        blood_pressure: referralRecord?.blood_pressure || "N/A",
        pulse_rate: referralRecord?.pulse_rate || "N/A",
        respiratory: referralRecord?.respiratory_rate || "N/A",
        temperature: referralRecord?.temperature || "N/A",
        spO2: referralRecord?.oxygen_saturation || "N/A",
        signs_and_symptoms: referralRecord?.signs_and_symptoms || "N/A",
        allergies: referralRecord?.allergies || "N/A",
        medications: referralRecord?.prescription || "N/A",
        past_medical_history: referralRecord?.past_medical_history || "N/A",
        last_oral_intake: referralRecord?.medication || "N/A",
        event_loading_to_injury: referralRecord?.assessment || "N/A",
        management: referralRecord?.nurse_notes || "N/A",
        remarks: referralRecord?.actions || "N/A",
        reason_for_consultation: referralRecord?.reason_for_consultation || "N/A",

        // ****** doctor ******
        doctor_fullname: doctorRecord?.fullname || "N/A",
        doctor_signature: doctorRecord?.signature || "N/A",
        doctor_prc_license: doctorRecord?.prc_license || "N/A",
      };

      outputDirectory = path.join(__dirname, `../../public/generatedPdf`);
      outputFilePath = path.join(outputDirectory, `generated_${referralFormPayload.student_id}.pdf`);

      if (!fs.existsSync(outputDirectory)) {
        return res.status(500).json({ message: "Output directory does not exist" });
      }

      await buildPDFDocsForReferralForm(referralFormPayload, outputFilePath);
    } else if (matchingKey === "physical-exam") {
      const physicalExamReportRecord = await getMedicalCertificateRecord(student_id);
      const doctorRecord = await getMedicalDoctor(doctor_id);

      const physicalExamReportPayload = {
        student_id: physicalExamReportRecord?.student_id || student_id,
        document_type: matchingKey,
        pe_no: generateUniquePeNo(),
        date: datenow.toLocaleDateString(),
        name: `${physicalExamReportRecord?.first_name} ${physicalExamReportRecord?.last_name}`,
        age: physicalExamReportRecord?.date_of_birth
          ? calculateAge(physicalExamReportRecord.date_of_birth as string)
          : "N/A",
        sex: physicalExamReportRecord?.sex || "N/A",
        address: physicalExamReportRecord?.address || "N/A",
        department: physicalExamReportRecord?.department || "N/A",
        section: "Block 1",
        contact_number: physicalExamReportRecord?.contact || "N/A",
        phinma_email: physicalExamReportRecord?.email || "N/A",
        blood_pressure: physicalExamReportRecord?.blood_pressure || "N/A",
        pulse_rate: physicalExamReportRecord?.pulse_rate || "N/A",
        respiratory: physicalExamReportRecord?.respiratory_rate || "N/A",
        temperature: physicalExamReportRecord?.temperature || "N/A",
        spO2: physicalExamReportRecord?.oxygen_saturation || "N/A",
        remarks: physicalExamReportRecord?.remarks || "N/A",

        // ****** doctor ******
        doctor_fullname: doctorRecord?.fullname || "N/A",
        doctor_signature: doctorRecord?.signature || "N/A",
        doctor_prc_license: doctorRecord?.prc_license || "N/A",
      };

      outputDirectory = path.join(__dirname, `../../public/generatedPdf`);
      outputFilePath = path.join(outputDirectory, `generated_${physicalExamReportPayload.student_id}.pdf`);

      if (!fs.existsSync(outputDirectory)) {
        return res.status(500).json({ message: "Output directory does not exist" });
      }

      await buildPDFDocsForPhysicalExamForm(physicalExamReportPayload, outputFilePath);
    }

    // Send the PDF file back in the response
    if (outputFilePath === "") {
      res.status(400).json({ message: "file path error", error: "error" });
    } else {
      res.download(outputFilePath, `generated_${matchingKey}.pdf`, (err) => {
        if (err) {
          console.error("Error sending PDF:", err);
          res.status(500).send("Error sending PDF file");
        }
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Error generating PDF", error: error.message });
    }
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};
