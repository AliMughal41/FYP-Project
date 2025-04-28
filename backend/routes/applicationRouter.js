import { updateApplicationStatus } from "../controllers/applicationController.js";
import express from "express";
import{isAuthenticated, isAuthorized} from "../middlewares/auth.js";
import { deleteApplication, 
         employerGetAllApplication, 
         jobSeekerGetAllApplication,
         postApplication } from "../controllers/applicationController.js";



const router = express.Router();

// Update Application Status
router.put(
  "/update-status/:applicationId",
  isAuthenticated,
  isAuthorized("Employer", "Admin"),  // Only Employer/Admin can update status
  updateApplicationStatus
);



router.post(
    "/post/:id",
    isAuthenticated,
    isAuthorized("Job Seeker"), // <--- This restricts the route to Job Seekers
    postApplication
  );
  

router.get("/employer/getall", isAuthenticated, isAuthorized("Employer"),employerGetAllApplication);

router.get("/jobseeker/getall", isAuthenticated, isAuthorized("Job Seeker"),jobSeekerGetAllApplication);

router.delete("/delete/:id", isAuthenticated,deleteApplication);

export default router;