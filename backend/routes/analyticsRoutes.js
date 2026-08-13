const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaint");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      // Total complaints
      const totalComplaints = await Complaint.countDocuments();

      // Complaints by status
      const statusStats = await Complaint.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      // Complaints by category
      const categoryStats = await Complaint.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);

      // Recent complaints
      const recentComplaints = await Complaint.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5);

      // Convert status results into easy-to-use values
      const pending =
        statusStats.find(
          (item) => item._id === "Pending"
        )?.count || 0;

      const inProgress =
        statusStats.find(
          (item) => item._id === "In Progress"
        )?.count || 0;

      const resolved =
        statusStats.find(
          (item) => item._id === "Resolved"
        )?.count || 0;

      res.status(200).json({
        totalComplaints,
        statusStats: {
          pending,
          inProgress,
          resolved,
        },
        categoryStats,
        recentComplaints,
      });
    } catch (error) {
      console.error("Analytics error:", error);

      res.status(500).json({
        message: "Error fetching analytics",
        error: error.message,
      });
    }
  }
);

module.exports = router;