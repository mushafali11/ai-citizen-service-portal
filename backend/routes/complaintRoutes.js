const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaint");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// CREATE A COMPLAINT
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Please provide title, description, and category",
      });
    }

    const complaint = new Complaint({
      title,
      description,
      category,
      user: req.user.userId,
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating complaint",
      error: error.message,
    });
  }
});


// GET ALL COMPLAINTS OF LOGGED-IN USER
router.get("/", authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching complaints",
      error: error.message,
    });
  }
});


// ADMIN: GET ALL COMPLAINTS
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const complaints = await Complaint.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json(complaints);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching all complaints",
        error: error.message,
      });
    }
  }
);


// ADMIN: UPDATE COMPLAINT STATUS
router.put(
  "/admin/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "In Progress",
        "Resolved",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      const complaint = await Complaint.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).populate("user", "name email");

      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found",
        });
      }

      res.status(200).json({
        message: "Complaint status updated successfully",
        complaint,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating complaint status",
        error: error.message,
      });
    }
  }
);


// GET ONE COMPLAINT
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching complaint",
      error: error.message,
    });
  }
});


// UPDATE A COMPLAINT
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, status } = req.body;

    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    if (title) complaint.title = title;
    if (description) complaint.description = description;
    if (category) complaint.category = category;
    if (status) complaint.status = status;

    await complaint.save();

    res.status(200).json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating complaint",
      error: error.message,
    });
  }
});


// DELETE A COMPLAINT
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting complaint",
      error: error.message,
    });
  }
});

module.exports = router;