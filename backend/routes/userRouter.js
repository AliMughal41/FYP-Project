import express from "express";
import {
  register,
  login,
  logout,
  getUser,
  updateProfile,
  updatePassword,
  forgotPassword,    // ← imported
  resetPassword      // ← imported
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Existing routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/getuser", isAuthenticated, getUser);
router.put("/update-profile", isAuthenticated, updateProfile);
router.put("/update-password", isAuthenticated, updatePassword);

// ——— NEW PASSWORD ROUTES ———
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;
