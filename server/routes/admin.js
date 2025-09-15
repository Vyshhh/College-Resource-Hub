import express from "express";
import User from "../models/User.js";
import Resource from "../models/Resource.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// ---------------- USERS ----------------

// Get all users (exclude admins)
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }, "-password").sort({
      createdAt: -1,
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change role (promote/demote)
router.put("/users/:id/role", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!["student", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activate/Deactivate student user
router.put("/users/:id/status", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role === "admin") {
      return res
        .status(403)
        .json({ error: "Cannot change status of an admin" });
    }

    user.status = status;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- STATS ----------------

// Admin stats
router.get("/stats", authMiddleware, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalResources = await Resource.countDocuments();
    const totalDownloads = await Resource.aggregate([
      { $group: { _id: null, downloads: { $sum: "$downloads" } } },
    ]);

    const mostActiveUsers = await Resource.aggregate([
      { $group: { _id: "$uploadedBy", uploads: { $sum: 1 } } },
      { $sort: { uploads: -1 } },
      { $limit: 5 },
    ]).lookup({
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user",
    });

    res.json({
      totalUsers,
      totalResources,
      totalDownloads: totalDownloads[0]?.downloads || 0,
      mostActiveUsers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- RESOURCES ----------------

// Admin: get all resources
router.get("/resources", authMiddleware, isAdmin, async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: delete resource
router.delete("/resources/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ error: "Resource not found" });
    res.json({ success: true, message: "Resource deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- STUDENT ----------------

// Student stats
router.get("/student-stats", authMiddleware, async (req, res) => {
  try {
    const totalResources = await Resource.countDocuments();
    const topResources = await Resource.find()
      .sort({ downloads: -1 })
      .limit(5)
      .select("title downloads");

    // ✅ Get uploads of logged-in user
    const myUploads = await Resource.find({ uploadedBy: req.user.id }).select(
      "title subject downloads createdAt"
    );

    res.json({ totalResources, topResources, myUploads });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student: delete own resource
router.delete("/student/resources/:id", authMiddleware, async (req, res) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id,
    });

    if (!resource)
      return res
        .status(404)
        .json({ error: "Resource not found or not authorized" });

    await resource.deleteOne();
    res.json({ success: true, message: "Your resource deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
