import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import {
  createPassword,
  createUser,
  emailExists,
  getAllUsers,
  getUserByEmail,
  isUserPasswordAlreadyActivated,
  updatePassword,
  updateUserContactNumber,
  updateUserStatus,
} from "../models/User";
import { generateToken } from "../utils/jwt";
import { AuthenticatedRequest } from "../middlewares/auth";
import { sendEmail } from "../utils/mail";
import { sendEmail2 } from "../utils/mailgun";
import dotenv from "dotenv";

dotenv.config();

interface UserProfile {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password?: string; // Optional field for internal use
  role: string;
  active: number;
}

export const isSuperAdmin = async (
  req: AuthenticatedRequest
): Promise<boolean> => {
  try {
    const email = req.user?.email;

    if (email) {
      const getUser = (await getUserByEmail(email)) as UserProfile;

      return getUser.role === "super_admin"; // Return true or false directly
    }
    return false; // Return false if no email
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("Error in Authentication");
    }
    return false; // Return false in case of an error
  }
};

export const isAdmin = async (req: AuthenticatedRequest): Promise<boolean> => {
  try {
    const email = req.user?.email;

    if (email) {
      const getUser = (await getUserByEmail(email)) as UserProfile;

      return getUser.role === "admin"; // Return true or false directly
    }
    return false; // Return false if no email
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("Error in Authentication");
    }
    return false; // Return false in case of an error
  }
};

export const signupController = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, temp_password, role } = req.body;

    const isAdminUser = await isAdmin(req);
    const isSuperAdminUser = await isSuperAdmin(req);

    if (!isAdminUser && !isSuperAdminUser) {
      return res
        .status(403)
        .json({ message: "Access denied: Unauthorized User" });
    }

    // Check if the email exists and ends with 'phinmaed.com'
    if (!email || !email.endsWith("@phinmaed.com")) {
      return res
        .status(400)
        .json({ message: "Invalid Email. Must be a phinmaed.com email." });
    }

    if (!firstname || !lastname || !email || !temp_password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the email is already taken
    const emailTaken = await emailExists(email);
    if (emailTaken) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    await createUser({ firstname, lastname, email, temp_password, role });

    const newUserCreatePassword = `${process.env.FRONTEND_URL}/create-password`;

    // HTML content with a welcome message and a link to change the default password
    const htmlContent = `
      <p>Welcome to the UCPIP portal!</p>
      <p>Your account has been created successfully. To get started, please create your own password by clicking the link below:</p>
      <p><strong>Important:</strong> You can change the default password to your own preferred password for secure access.</p>
      <a href="${newUserCreatePassword}" target="_blank">Create Your Password</a>
    `;

    // Send the welcome email with the password creation link
    await sendEmail2(
      // await sendEmail(
      email,
      "Welcome to UCPIP - Set Your Password",
      "Welcome to the UCPIP portal. Please click the link below to set your own password.",
      htmlContent
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const userCreatePassword = async (req: Request, res: Response) => {
  try {
    const { email, password, action } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const getUser = await getUserByEmail(email);

    if (!getUser) {
      return res.status(401).json({ message: "Invalid email" });
    }

    if (action === "update_password") {
      // update the password

      const updateForgotPassword = await updatePassword(
        getUser.email,
        password
      );
      if (!updateForgotPassword) {
        return res.status(500).json({ message: "Something went wrong" });
      }
      return res.status(200).json({ message: "Successfully update" });
    }
    // create new password
    const createNewPassword = await createPassword(getUser.email, password);

    if (!createNewPassword) {
      return res.status(500).json({ message: "Something went wrong" });
    }
    return res.status(200).json({ message: "Successfully update" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error Updating", error: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Check if the email exists and ends with 'phinmaed.com'
    if (!email || !email.endsWith("@phinmaed.com")) {
      return res
        .status(400)
        .json({ message: "Invalid Email. Must be a phinmaed.com email." });
    }

    // Assume getUserByEmail is a function that retrieves the user by email
    const getUser = await getUserByEmail(email);

    if (!getUser) {
      return res.status(401).json({ message: "Invalid email" });
    }

    // Ensure the email is properly encoded to avoid issues with special characters
    const emailEncoded = encodeURIComponent(getUser.email);

    // Add the email as a query parameter to the reset password link
    const resetPasswordLink = `${process.env.FRONTEND_URL}/update-password?email=${emailEncoded}`;

    // HTML content with a link
    const htmlContent = `
      <p>Click the link below to reset your password:</p>
      <a href="${resetPasswordLink}" target="_blank">Reset Password</a>
    `;

    // Send the reset password email
    const updateForgotPassword = await sendEmail2(
      getUser.email,
      "UCPIP Request Reset Password",
      "Please reset your password using the link below.",
      htmlContent
    );

    if (!updateForgotPassword) {
      return res.status(500).json({ message: "Something went wrong" });
    }

    return res
      .status(200)
      .json({ message: "Password reset email sent successfully." });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error Updating", error: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const signInController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let getUser = await getUserByEmail(email);

    if (!getUser) {
      // Fallback Admin Login
      if (
        email === process.env.FALLBACK_ADMIN &&
        password === process.env.FALLBACK_PASSWORD
      ) {
        // Generate a token for the fallback admin
        const token = generateToken(
          "fallback_admin",
          process.env.FALLBACK_ADMIN ?? ""
        );

        res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 8 * 3600000, // 8 hours in milliseconds
        });

        return res.status(200).json({
          message: "Login successful (Fallback Admin)",
          email: process.env.FALLBACK_ADMIN,
          fullname: "Super Admin",
          role: "super_admin",
        });
      }

      return res.status(401).json({ message: "Invalid email or password" });
    }

    const checkIsUserPasswordAlreadyActivated =
      await isUserPasswordAlreadyActivated(getUser.email);

    if (!checkIsUserPasswordAlreadyActivated) {
      return res.status(401).json({
        message: "Please change your password first from default password",
        error: "password activation",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, getUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (getUser.active === 0) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = generateToken(getUser.id, getUser.email);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 8 * 3600000, // 8 hours in milliseconds
    });

    return res.status(200).json({
      message: "Login successful",
      email: getUser.email,
      fullname: `${getUser.firstname} ${getUser.lastname}`,
      role: getUser.role,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error Logging in", error: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const logoutController = (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error logging out", error: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const isAdminUser = await isAdmin(req);
    const isSuperAdminUser = await isSuperAdmin(req);

    if (!isAdminUser && !isSuperAdminUser) {
      return res
        .status(403)
        .json({ message: "Access denied: Unauthorized User" });
    }

    const allUsers = await getAllUsers();
    return res.json(allUsers);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error fetching users", error: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const userStatus = async (req: Request, res: Response) => {
  try {
    const isAdminUser = await isAdmin(req);

    if (!isAdminUser) {
      return res
        .status(403)
        .json({ message: "Access denied: Unauthorized User" });
    }

    const updateStat = await updateUserStatus(req.body);

    if (updateStat) {
      return res.status(200).json(true);
    }
    return res.status(200).json(false);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error fetching users", error: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const updateContactNumber = async (req: Request, res: Response) => {
  try {
    const updateContactNumber = await updateUserContactNumber(req.body);

    if (updateContactNumber) {
      return res.status(200).json(true);
    }
    return res.status(200).json(false);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        message: "Error updating users contact number",
        error: error.message,
      });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};
