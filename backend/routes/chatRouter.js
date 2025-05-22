// chatRouter.js
import express from "express";
import { saveMessage, getChatMessages } from "../controllers/chatController.js"; 

const router = express.Router();

router.post("/send", saveMessage);  // Route for sending messages
router.get("/messages/:senderId/:receiverId", getChatMessages);  // Route for getting messages

export default router;
