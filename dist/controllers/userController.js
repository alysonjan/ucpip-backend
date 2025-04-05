"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContactNumber =
  exports.userStatus =
  exports.getUsers =
  exports.logoutController =
  exports.signInController =
  exports.resetPassword =
  exports.userCreatePassword =
  exports.signupController =
  exports.isAdmin =
  exports.isSuperAdmin =
    void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
const mailgun_1 = require("../utils/mailgun");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isSuperAdmin = (req) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const email =
        (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
      if (email) {
        const getUser = yield (0, User_1.getUserByEmail)(email);
        return getUser.role === "super_admin"; // Return true or false directly
      }
      return false; // Return false if no email
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Error in Authentication");
      }
      return false; // Return false in case of an error
    }
  });
exports.isSuperAdmin = isSuperAdmin;
const isAdmin = (req) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const email =
        (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
      if (email) {
        const getUser = yield (0, User_1.getUserByEmail)(email);
        return getUser.role === "admin"; // Return true or false directly
      }
      return false; // Return false if no email
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Error in Authentication");
      }
      return false; // Return false in case of an error
    }
  });
exports.isAdmin = isAdmin;
const signupController = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { firstname, lastname, email, temp_password, role } = req.body;
      const isAdminUser = yield (0, exports.isAdmin)(req);
      const isSuperAdminUser = yield (0, exports.isSuperAdmin)(req);
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
      const emailTaken = yield (0, User_1.emailExists)(email);
      if (emailTaken) {
        return res.status(400).json({ message: "Email is already taken" });
      }
      yield (0,
      User_1.createUser)({ firstname, lastname, email, temp_password, role });
      const newUserCreatePassword = `${process.env.FRONTEND_URL}/create-password`;
      // HTML content with a welcome message and a link to change the default password
      const htmlContent = `
      <p>Welcome to the UCPIP portal!</p>
      <p>Your account has been created successfully. To get started, please create your own password by clicking the link below:</p>
      <p><strong>Important:</strong> You can change the default password to your own preferred password for secure access.</p>
      <a href="${newUserCreatePassword}" target="_blank">Create Your Password</a>
    `;
      // Send the welcome email with the password creation link
      yield (0, mailgun_1.sendEmail2)(
        // await sendEmail(
        email,
        "Welcome to UCPIP - Set Your Password",
        "Welcome to the UCPIP portal. Please click the link below to set your own password.",
        htmlContent
      );
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Error creating user", error: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  });
exports.signupController = signupController;
const userCreatePassword = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { email, password, action } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const getUser = yield (0, User_1.getUserByEmail)(email);
      if (!getUser) {
        return res.status(401).json({ message: "Invalid email" });
      }
      if (action === "update_password") {
        // update the password
        const updateForgotPassword = yield (0, User_1.updatePassword)(
          getUser.email,
          password
        );
        if (!updateForgotPassword) {
          return res.status(500).json({ message: "Something went wrong" });
        }
        return res.status(200).json({ message: "Successfully update" });
      }
      // create new password
      const createNewPassword = yield (0, User_1.createPassword)(
        getUser.email,
        password
      );
      if (!createNewPassword) {
        return res.status(500).json({ message: "Something went wrong" });
      }
      return res.status(200).json({ message: "Successfully update" });
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Error Updating", error: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  });
exports.userCreatePassword = userCreatePassword;
const resetPassword = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { email } = req.body;
      // Check if the email exists and ends with 'phinmaed.com'
      if (!email || !email.endsWith("@phinmaed.com")) {
        return res
          .status(400)
          .json({ message: "Invalid Email. Must be a phinmaed.com email." });
      }
      // Assume getUserByEmail is a function that retrieves the user by email
      const getUser = yield (0, User_1.getUserByEmail)(email);
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
      const updateForgotPassword = yield (0, mailgun_1.sendEmail2)(
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
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Error Updating", error: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  });
exports.resetPassword = resetPassword;
// export const signInController = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     const getUser = await getUserByEmail(email);
//     if (!getUser) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }
//     const checkIsUserPasswordAlreadyActivated = await isUserPasswordAlreadyActivated(getUser.email);
//     if (!checkIsUserPasswordAlreadyActivated) {
//       return res
//         .status(401)
//         .json({ message: "Please change your password first from default password", error: "password activation" });
//     }
//     const isPasswordValid = await bcrypt.compare(password, getUser.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }
//     if (getUser.active === 0) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     const token = generateToken(getUser.id, getUser.email);
//     res.cookie("jwt", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 8 * 3600000, // 8 hour in milliseconds
//       // maxAge: 5 * 1000, // 5 seconds in milliseconds
//     });
//     return res.status(200).json({
//       message: "Login successful",
//       email: getUser.email,
//       fullname: `${getUser.firstname} ${getUser.lastname}`,
//       role: getUser.role,
//     });
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       res.status(500).json({ message: "Error Logging in", error: error.message });
//     } else {
//       res.status(500).json({ message: "An unexpected error occurred" });
//     }
//   }
// };
const signInController = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      let getUser = yield (0, User_1.getUserByEmail)(email);
      if (!getUser) {
        // Fallback Admin Login
        if (
          email === process.env.FALLBACK_ADMIN &&
          password === process.env.FALLBACK_PASSWORD
        ) {
          // Generate a token for the fallback admin
          const token = (0, jwt_1.generateToken)(
            "fallback_admin",
            (_a = process.env.FALLBACK_ADMIN) !== null && _a !== void 0
              ? _a
              : ""
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
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
      const checkIsUserPasswordAlreadyActivated = yield (0,
      User_1.isUserPasswordAlreadyActivated)(getUser.email);
      if (!checkIsUserPasswordAlreadyActivated) {
        return res.status(401).json({
          message: "Please change your password first from default password",
          error: "password activation",
        });
      }
      const isPasswordValid = yield bcryptjs_1.default.compare(
        password,
        getUser.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      if (getUser.active === 0) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const token = (0, jwt_1.generateToken)(getUser.id, getUser.email);
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 8 * 3600000, // 8 hours in milliseconds
      });
      return res.status(200).json({
        message: "Login successful",
        email: getUser.email,
        fullname: `${getUser.firstname} ${getUser.lastname}`,
        role: getUser.role,
      });
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Error Logging in", error: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  });
exports.signInController = signInController;
const logoutController = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error logging out", error: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};
exports.logoutController = logoutController;
const getUsers = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const isAdminUser = yield (0, exports.isAdmin)(req);
      const isSuperAdminUser = yield (0, exports.isSuperAdmin)(req);
      if (!isAdminUser && !isSuperAdminUser) {
        return res
          .status(403)
          .json({ message: "Access denied: Unauthorized User" });
      }
      const allUsers = yield (0, User_1.getAllUsers)();
      return res.json(allUsers);
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Error fetching users", error: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  });
exports.getUsers = getUsers;
const userStatus = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const isAdminUser = yield (0, exports.isAdmin)(req);
      if (!isAdminUser) {
        return res
          .status(403)
          .json({ message: "Access denied: Unauthorized User" });
      }
      const updateStat = yield (0, User_1.updateUserStatus)(req.body);
      if (updateStat) {
        return res.status(200).json(true);
      }
      return res.status(200).json(false);
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Error fetching users", error: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  });
exports.userStatus = userStatus;
const updateContactNumber = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const updateContactNumber = yield (0, User_1.updateUserContactNumber)(
        req.body
      );
      if (updateContactNumber) {
        return res.status(200).json(true);
      }
      return res.status(200).json(false);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          message: "Error updating users contact number",
          error: error.message,
        });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  });
exports.updateContactNumber = updateContactNumber;
