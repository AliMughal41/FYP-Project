import { Message } from "../models/chatSchema.js"; // Correct named import

export const saveMessage = async (req, res, next) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const newMessage = await Message.create({ senderId, receiverId, message });
    res.status(200).json({ success: true, newMessage });
  } catch (error) {
    next(error);
  }
};

export const getChatMessages = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ timestamp: 1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};
