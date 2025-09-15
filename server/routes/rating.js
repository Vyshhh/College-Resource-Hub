import express from "express";
import Resource from "../models/Resource.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add or update rating from a user
router.post("/:id/rate", authMiddleware, async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const userId = req.user.id;
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: "Resource not found" });

    // check if user already rated -> update, else push
    const existing = resource.ratings.find(r => String(r.user) === String(userId));
    if (existing) {
      existing.score = score;
      existing.feedback = feedback;
      existing.createdAt = new Date();
    } else {
      resource.ratings.push({ user: userId, score, feedback });
    }

    // Recalculate avgRating
    const total = resource.ratings.reduce((s, r) => s + (r.score || 0), 0);
    resource.avgRating = resource.ratings.length ? (total / resource.ratings.length) : 0;

    await resource.save();
    res.json({ success: true, avgRating: resource.avgRating, ratingsCount: resource.ratings.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
