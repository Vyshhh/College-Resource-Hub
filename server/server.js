import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { MONGO_URI, PORT } from "./config.js";

import authRoutes from "./routes/auth.js";
import resourceRoutes from "./routes/resources.js";
import ratingRoutes from "./routes/rating.js";
import adminRoutes from "./routes/admin.js"; 

const app = express();
app.use(cors());
app.use(express.json());

// static uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/admin", adminRoutes); // ✅

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
