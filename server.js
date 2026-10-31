import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Feedback from "./models/Feedback.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// GET API: Fetch all feedback
app.get("/api/feedback", async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Fetch error:", error.message);
    res.status(500).json({
      message: "Failed to fetch feedback"
    });
  }
});

// POST API: Save new feedback
app.post("/api/feedback", async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      !Number.isInteger(Number(rating)) ||
      Number(rating) < 1 ||
      Number(rating) > 5 ||
      typeof comment !== "string" ||
      !comment.trim()
    ) {
      return res.status(400).json({
        message: "Please enter a valid name, rating (1-5), and comment."
      });
    }

    const newFeedback = await Feedback.create({
      name: name.trim(),
      rating: Number(rating),
      comment: comment.trim()
    });

    res.status(201).json({
      message: "Feedback submitted successfully!",
      feedback: newFeedback
    });
  } catch (error) {
    console.error("Save error:", error.message);
    res.status(500).json({
      message: "Failed to save feedback"
    });
  }
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error.message);
    console.error("Reason:", error.reason?.toString());
    console.error("URI host:", process.env.MONGODB_URI?.split("@")[1]?.split("/")[0]);
    process.exit(1);
  }
  // catch (error) {
  //   console.error("Server startup error:", error.message);
  //   process.exit(1);
  // }


}

startServer();