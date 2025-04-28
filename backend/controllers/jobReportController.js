import { Job } from "../models/jobSchema.js";

import JobReport from "../models/jobReportModel.js";

import ErrorHandler from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

// Report a Job
export const reportJob = catchAsyncErrors(async (req, res, next) => {
    const { jobId } = req.params;
    const { reason, description } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
        return next(new ErrorHandler("Job not found", 404));
    }

    const report = await JobReport.create({
        job: jobId,
        reportedBy: req.user._id,
        reason,
        description,
    });

    res.status(200).json({
        success: true,
        message: "Job reported successfully",
        report,
    });
});

// Admin - Get All Reported Jobs
export const getAllReportedJobs = catchAsyncErrors(async (req, res, next) => {
    const reports = await JobReport.find()
        .populate("job", "title companyName location")
        .populate("reportedBy", "name email");

    res.status(200).json({
        success: true,
        reports,
    });
});

// Admin - Delete a Job
export const deleteJob = catchAsyncErrors(async (req, res, next) => {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
        return next(new ErrorHandler("Job not found", 404));
    }

    await job.deleteOne();

    res.status(200).json({
        success: true,
        message: "Job deleted successfully",
    });
});
