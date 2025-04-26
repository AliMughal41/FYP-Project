import mongoose from "mongoose"; 


export const connection = ()=>{
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "JOB_PORTAL"
}).then(()=>{
    console.log("Connected To Database. ")
}).catch(err=>{
    console.log(`Some Error Occurred While Connecting to Database: ${err}`)
})
}