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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const User_1 = require("../models/User");
exports.default = (router) => {
    // Signup route
    router.post("/signup", auth_1.authenticateToken, userController_1.signupController);
    // Signin route
    router.post("/signin", userController_1.signInController);
    router.post("/signin-superadmin", userController_1.signInController);
    router.post("/logout", userController_1.logoutController);
    // ADMINISTRATION
    router.get("/users", auth_1.authenticateToken, userController_1.getUsers);
    router.post("/user/status", auth_1.authenticateToken, userController_1.userStatus);
    router.post("/create-password", userController_1.userCreatePassword);
    router.post("/reset-password", userController_1.resetPassword);
    router.post("/update-contact_number", userController_1.updateContactNumber);
    // Authenticated route
    router.get("/auth/me", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        if (email) {
            try {
                const userProfile = (yield (0, User_1.getUserByEmail)(email));
                const { password } = userProfile, profileWithoutPassword = __rest(userProfile, ["password"]);
                res.status(200).json({
                    auth: req.user,
                    profile: profileWithoutPassword,
                });
            }
            catch (error) {
                res.status(500).json({ message: "Error fetching user profile" });
            }
        }
        else {
            res.status(400).json({ message: "User email is not defined" });
        }
    }));
    return router;
};
