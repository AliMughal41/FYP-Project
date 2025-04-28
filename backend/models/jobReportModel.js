import mongoose from "mongoose";

const jobReportSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reason: {
        type: String,
        required: [true, "Please provide a reason for reporting."],
    },
    description: {
        type: String,
    },
    reportedAt: {
        type: Date,
        default: Date.now,
    },
});

const JobReport = mongoose.model("JobReport", jobReportSchema);

export default JobReport;
