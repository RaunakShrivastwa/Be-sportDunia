import express from "express";
import dotenv from "dotenv";
import DB from "./config/Db.js"; // Assuming DB connection logic is here
import userRoutes from "./router/userRouter.js";
import earningsRoutes from "./router/earningRouter.js";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

dotenv.config();
const app = express();
const server = http.createServer(app);

// Socket.IO server setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Ensure this matches your client-side URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));


app.use((req, res, next) => {
  req.io = io; 
  next();
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/earnings", earningsRoutes);


// Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.emit("user", {
    message: "Welcome to the platform!",
    userId: socket.id,
  });

 

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
