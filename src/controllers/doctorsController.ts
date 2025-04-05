import { Request, Response } from "express";
import { checkDoctorIfExist, createNewDoctor, getDoctors, removeDoctor, updateDoctor } from "../models/Doctors";

import { Readable } from "stream";

// Define a custom interface that fully complies with Express.Multer.File
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string; // now required
  filename: string; // now required
  path: string; // now required
  buffer: Buffer;
  stream: Readable;
}

interface MulterRequest extends Request {
  file?: MulterFile;
}

// export const saveDoctor = async (req: Request, res: Response) => {

export const saveDoctor = async (req: MulterRequest, res: Response) => {
  try {
    const { action, fullname, prc_license, id } = req.body;

    if (action === "edit") {
      const doctorpayloadUpdate = {
        id,
        fullname,
        prc_license,
      };

      await updateDoctor(doctorpayloadUpdate);
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

    const isDoctorExist = await checkDoctorIfExist(prc_license);

    if (isDoctorExist) {
      return res.status(400).json({ message: "Doctor already exist" });
    }
    await createNewDoctor(doctorpayload);
    return res.status(201).json({ message: "Doctor added successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Something went wrong", error: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    await removeDoctor(id);
    return res.status(200).json({ message: "successfully deleted" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Something went wrong", error: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const doctors = async (req: Request, res: Response) => {
  try {
    const docs = await getDoctors();

    return res.status(200).json(docs);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: "Error fetching Doctors", error: error.message });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};
