import express from "express";
import path from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
// import { Server } from 'socket.io'; // Import the Server class
import dotenv from "dotenv";
import dialogflowRoutes from "./routes/dialogflow.js";
// import notificationsRoutes from "./routes/notification.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Setup Socket.IO
// const server = app.listen(port, () => {
//   console.log(`Server Running at ${port}`);
// });

// // Create a Socket.IO instance and pass the existing server with CORS configuration
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // This should match the origin of your frontend
//     methods: ["GET", "POST"],
//   },
// });
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// io.on("connection", (socket) => {
//   console.log("Connected to Socket.IO");

//   socket.on("orderStored", (data) => {
//     console.log("Product stored:", data.message);
//     io.emit("orderStored", data); // Broadcast the event to all connected clients
//   });
// });

// Configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS for Express
// app.use(
//   cors({
//     origin: "http://localhost:5173", // This should match the origin of your frontend
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );

// Define routes
app.use("/api/dialogflow", dialogflowRoutes);
// app.use("/api/notifications", notificationsRoutes);

// Serve static files for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

export default app;
