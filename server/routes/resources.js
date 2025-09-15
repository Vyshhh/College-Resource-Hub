import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Resource from "../models/Resource.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Multer: preserve extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".pdf";
    cb(null, Date.now() + ext);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF/DOC files allowed"), false);
  }
});

// ✅ Upload (any authenticated user)
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { title, subject, semester, tags } = req.body;
    const resource = await Resource.create({
      title,
      subject,
      semester,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
      fileUrl: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.id
    });
    res.json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ List/Search
router.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q
      ? {
          $or: [
            { title: new RegExp(q, "i") },
            { subject: new RegExp(q, "i") },
            { tags: new RegExp(q, "i") }
          ]
        }
      : {};
    const resources = await Resource.find(filter)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Top Rated
router.get("/top-rated", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "6", 10);
    const resources = await Resource.find({})
      .sort({ avgRating: -1, "ratings.length": -1 })
      .limit(limit)
      .lean();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Most Downloaded
router.get("/most-downloaded", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "6", 10);
    const resources = await Resource.find({})
      .sort({ downloads: -1 })
      .limit(limit)
      .lean();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ My Uploads (user-only)
router.get("/my-uploads", authMiddleware, async (req, res) => {
  try {
    const resources = await Resource.find({ uploadedBy: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete My Upload
router.delete("/my/:id", authMiddleware, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: "Resource not found" });

    // check ownership
    if (resource.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // remove file
    const filePath = path.join(process.cwd(), resource.fileUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await resource.remove();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ View PDF inline
router.get("/:id/view", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: "Resource not found" });
    const filePath = path.join(process.cwd(), resource.fileUrl);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Download increments count
router.get("/:id/download", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: "Resource not found" });
    const filePath = path.join(process.cwd(), resource.fileUrl);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });

    resource.downloads = (resource.downloads || 0) + 1;
    await resource.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${path.basename(filePath)}`);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin-only delete
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: "Not found" });

    const filePath = path.join(process.cwd(), resource.fileUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await resource.remove();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Recommendations
router.get("/recommendations", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const ratedResources = await Resource.find({ "ratings.user": userId });
    const preferredTags = new Set();
    ratedResources.forEach(r => r.tags.forEach(tag => preferredTags.add(tag)));
    const preferredSubjects = new Set(ratedResources.map(r => r.subject));

    if (preferredTags.size === 0 && preferredSubjects.size === 0) {
      const fallback = await Resource.find()
        .sort({ avgRating: -1, downloads: -1 })
        .limit(6);
      return res.json(fallback);
    }

    const recommendations = await Resource.find({
      $or: [
        { tags: { $in: Array.from(preferredTags) } },
        { subject: { $in: Array.from(preferredSubjects) } }
      ]
    })
      .sort({ avgRating: -1, downloads: -1 })
      .limit(6);

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
