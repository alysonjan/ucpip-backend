import { Router, Response } from "express";
import {
  signupController,
  signInController,
  logoutController,
  getUsers,
  userStatus,
  userCreatePassword,
  resetPassword,
  updateContactNumber,
} from "../controllers/userController";
import { AuthenticatedRequest, authenticateToken } from "../middlewares/auth";
import { getUserByEmail } from "../models/User";

interface UserProfile {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  password?: string; // Optional field for internal use
}

export default (router: Router) => {
  // Signup route
  router.post("/signup", authenticateToken, signupController);

  // Signin route
  router.post("/signin", signInController);
  router.post("/signin-superadmin", signInController);

  router.post("/logout", logoutController);

  // ADMINISTRATION
  router.get("/users", authenticateToken, getUsers);
  router.post("/user/status", authenticateToken, userStatus);
  router.post("/create-password", userCreatePassword);
  router.post("/reset-password", resetPassword);
  router.post("/update-contact_number", updateContactNumber);

  // Authenticated route
  router.get("/auth/me", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const email = req.user?.email;

    if (email) {
      try {
        const userProfile = (await getUserByEmail(email)) as UserProfile;

        const { password, ...profileWithoutPassword } = userProfile;

        res.status(200).json({
          auth: req.user,
          profile: profileWithoutPassword,
        });
      } catch (error) {
        res.status(500).json({ message: "Error fetching user profile" });
      }
    } else {
      res.status(400).json({ message: "User email is not defined" });
    }
  });

  return router;
};
