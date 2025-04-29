import mongoose from "mongoose";

// Message Schema Definition
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Export Message as a named export
export const Message = mongoose.model("Message", messageSchema);
export default Message;
