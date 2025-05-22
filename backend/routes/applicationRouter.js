import { updateApplicationStatus } from "../controllers/applicationController.js";
import express from "express";
import{isAuthenticated, isAuthorized} from "../middlewares/auth.js";
import { deleteApplication, 
         employerGetAllApplication, 
         jobSeekerGetAllApplication,
         postApplication } from "../controllers/applicationController.js";



const router = express.Router();

// Update Application Status
router.put("/update-status/:applicationId",isAuthenticated, isAuthorized("Employer", "Admin"),updateApplicationStatus);


// post job application
router.post("/post/:id", isAuthenticated,isAuthorized("Job Seeker"),postApplication);
  
// employer get our all applications
router.get("/employer/getall", isAuthenticated, isAuthorized("Employer"),employerGetAllApplication);

// job seeker get all applications
router.get("/jobseeker/getall", isAuthenticated, isAuthorized("Job Seeker"),jobSeekerGetAllApplication);

// delete any application by employer
router.delete("/delete/:id", isAuthenticated,deleteApplication);

export default router;