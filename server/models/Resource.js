import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  score: { type: Number, min: 1, max: 5 },
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});

const resourceSchema = new mongoose.Schema({
  title: String,
  subject: String,
  semester: String,
  tags: [String],
  fileUrl: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ratings: [ratingSchema],
  avgRating: { type: Number, default: 0 }, // store average for quick queries
  downloads: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Resource", resourceSchema);
