


import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import {v2 as cloudinary} from "cloudinary";


export const postApplication = catchAsyncErrors(async (req, res, next)=>{
    const {id} = req.params;
    const{name, email, phone, address, coverLetter} = req.body;
    if(!name || !email || !phone || !address || !coverLetter){
        return next(new ErrorHandler("All fields are required.", 400))
    }
    
    const JobSeekerInfo = {
        id: req.user._id,
        name,
        email,
        phone,
        address,
        coverLetter,
        role: "Job Seeker",
    };
    const jobDetails = await Job.findById(id);
    if(!jobDetails){
        return next (new ErrorHandler("Job not found.", 400));
    }

    const isAlreadyApplied = await Application.findOne({
        "jobInfo.id": id,
        "JobSeekerInfo.id": req.user_id,
    });
    if(isAlreadyApplied){
        return next (new ErrorHandler("You have already applied for this job.", 400));
    }

    if(req.files && req.files.resume){
        const {resume} = req.files;
        try{
            const cloudinaryResponse =  await cloudinary.uploader.upload(resume.tempFilePath,{
                folder: "Job|-Seeker_Resume"
            });
            if(!cloudinaryResponse || cloudinaryResponse.error){
                return next(new ErrorHandler("Failed to upload resume to cloudinary.", 500) );
            }
                JobSeekerInfo.resume = {
                    public_id: cloudinaryResponse.piblic_id,
                    url: cloudinaryResponse.secure_url
                
            }
        }catch(error){
                return next(new ErrorHandler("Failed to upload resume.", 500))
        }
    } else {
        if(req.user && !req.user.resume.url){
            return next (new ErrorHandler("Please upload your resume.", 400));
        }
        JobSeekerInfo.resume = {
            punlic_id: req.user && req.user.resume.public_id,
            url: req.user && req.user.resume.url,
        }
    }
    const employerInfo = {
        id: jobDetails.postedBy,
        role: "Employer"
    }
    const jobInfo ={
        jobId: id,
        jobTitle: jobDetails.title
    };
    const application = await Application.create({
        JobSeekerInfo,
        employerInfo,
        jobInfo,
    });
    res.status(201).json({
        success: true,
        message: "Application submitted.",
        application,
    });
});
export const employerGetAllApplication = catchAsyncErrors(
    async (req, res, next)=>{
    const {_id} = req.user;
    const applications = await Application.find({
        "employerInfo.id": _id,
        "deletedBy.employer": false,
      });
    res.status(200).json({
        success: true,
        applications,
    });
});
export const jobSeekerGetAllApplication = catchAsyncErrors(async (req, res, next)=>{
    const {_id} = req.user;
    const applications = await Application.find({
        "JobSeekerInfo.id": _id,
        "deletedBy.jobSeeker": false,
      });
    res.status(200).json({
        success: true,
        applications,
    });
});
export const deleteApplication = catchAsyncErrors(async (req, res, next)=>{

    const{id} = req.params;
    const application = await Application.findById(id);
    if (!application){
        return next(new ErrorHandler("Application not found.", 404));
    }
        const{role} = req.user;
        switch(role) {
          case"Job Seeker":
            application.deletedBy.jobSeeker = true;
            await application.save()
            break;
        case"Employer":
            application.deletedBy.employer = true;
            await application.save()
            break;


            default:
                console.log("Default case for application delete function.")
                break;
        }

        if (application.deletedBy.employer === true && 
        application.deletedBy.jobSeeker === true){
            await application.deleteOne();
        } 
        res.status(200).json({
            success: true,
            message: "Application Deleted."
        });
});


// Update application status
export const updateApplicationStatus = catchAsyncErrors(async (req, res, next) => {
    const { applicationId } = req.params;
    const { status } = req.body; // "Shortlisted", "Rejected", "Under Review"

    const application = await Application.findById(applicationId);
    if (!application) {
        return next(new ErrorHandler("Application not found", 404));
    }

    application.status = status;
    await application.save();

    res.status(200).json({
        success: true,
        message: `Application status updated to ${status}`,
        application,
    });
});