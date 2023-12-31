import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // Import the 'path' module

import dialogflowRoutes from "./routes/dialogflow.js";

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

// Enable CORS for a specific origin
app.use(cors({ origin: 'https://frontend-bot-seven.vercel.app' }));

// Configure body parser (if you need it for other middleware)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handle preflight requests for the specific route
app.options("/api/dialogflow/textQuery", cors({ origin: 'https://frontend-bot-seven.vercel.app' }));

// Define routes
app.use("/api/dialogflow", dialogflowRoutes);

// Serve static files for production
if (process.env.NODE_ENV === "production") {
  // Adjust the static file path as needed
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});

export default app;
