import express from "express";
import { reportJob, getAllReportedJobs, deleteJob } from "../controllers/jobReportController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

// User Report a job
router.post("/report/:jobId", isAuthenticated, reportJob);

// Admin View reported jobs
router.get("/admin/reported-jobs", isAuthenticated, isAuthorized("Admin"), getAllReportedJobs);

// Admin Delete a reported job
router.delete("/admin/delete-job/:jobId", isAuthenticated, isAuthorized("Admin"), deleteJob);

export default router;
