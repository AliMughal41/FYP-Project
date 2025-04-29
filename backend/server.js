import { Server } from "socket.io";
import http from "http";
import app from "./app.js";


import cloudinary from "cloudinary";


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Server setup for real-time messaging
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// Real-time messaging logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", (data) => {
    io.to(data.receiverId).emit("receive_message", data);
  });

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.listen(process.env.PORT, () => {
    console.log(`Server listening at port ${process.env.PORT}`);
  });


