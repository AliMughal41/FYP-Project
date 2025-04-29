import jobReportRouter from "./routes/jobReportRouter.js";
import chatRouter from "./routes/chatRouter.js";

import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import {connection} from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import { newsLetterCron } from "./automation/newsLetterCron.js";





const app = express();

config({ path: "./config/config.env" });

app.use(
    cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET,POST,PUT,DELETE"],
    credentials: true,
})
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/chat", chatRouter);


app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
}));


app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

app.use("/api/v1/job", jobReportRouter);

newsLetterCron();

connection();
app.use(errorMiddleware);

export default app;