import cron from "node-cron";
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";



export const newsLetterCron = ()=>{
    cron.schedule("*/1 * * * *", async()=>{
        console.log("Running cron automation")
        const jobs= await Job.find({newsLettersSend: false});
        for(const job of jobs){
            try{
                const filteredUsers = await User.find({
                    $or:[
                        {"niches.firstNiche":job.jobNiche},
                        {"niches.secondNiche":job.jobNiche},
                        {"niches.thirdNiche":job.jobNiche},
                    ],
                });
                for (const user of filteredUsers){
                    const subject = `Hot Job Alert: ${job.title} on ${job.jobNiche} Available Now`;
                    const message = `Hi ${user.name},\n\nGreat news! A new job thet fits yuor niche has been posted. The possition is for a ${job.title} with ${job.companyName}, and they are looking to hire immediately.\n\nJob details:\n- **possition:** ${job.title}\n- **company:**    ${job.companyName}\n- **location:** ${job.location}\n- **salary:** ${job.salary}\n\n Don't wait too long! Job openings like these are filled quickly. \n\nWe're here to support you in your job search. Best of lick\n\nBest Regards,\nSKILL BRIDGE TEAM`

                    sendEmail({
                        email:user.email,
                        subject,
                        message,
                    });
                    
                }
                job.newsLettersSend = true;
                await job.save();
            }catch(error){
                console.log("ERROR IN CRON CATCH BLOCK");
                return next(comsole.error(error || "Some error in cron."));
            }
            
        }
    });
}