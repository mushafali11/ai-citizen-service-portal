const express = require("express");

const router = express.Router();

// AI CHATBOT
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please provide a message",
      });
    }

    const userMessage = message.toLowerCase().trim();

    let reply;

    // GREETING
    if (
      userMessage.includes("hello") ||
      userMessage.includes("hi") ||
      userMessage.includes("hey")
    ) {
      reply =
        "Hello! 👋 I am the Citizen Service Portal assistant. I can help you submit, track, edit, or delete complaints. What would you like to know?";
    }

    // STATUS / TRACKING
    else if (
      userMessage.includes("status") ||
      userMessage.includes("track") ||
      userMessage.includes("progress")
    ) {
      reply =
        "You can check your complaint status by opening 'My Complaints' from the Citizen Dashboard. A complaint can be Pending, In Progress, or Resolved.";
    }

    // STATUS: PENDING
    else if (userMessage.includes("pending")) {
      reply =
        "Pending means your complaint has been submitted successfully and is waiting to be reviewed or processed.";
    }

    // STATUS: IN PROGRESS
    else if (
      userMessage.includes("in progress") ||
      userMessage.includes("processing")
    ) {
      reply =
        "In Progress means that your complaint is currently being reviewed or handled by the relevant authority.";
    }

    // STATUS: RESOLVED
    else if (
      userMessage.includes("resolved") ||
      userMessage.includes("completed") ||
      userMessage.includes("fixed")
    ) {
      reply =
        "Resolved means that the complaint has been marked as completed by the administrator.";
    }

    // EDIT
    else if (
      userMessage.includes("edit") ||
      userMessage.includes("change") ||
      userMessage.includes("update")
    ) {
      reply =
        "You can edit your complaint by opening 'My Complaints' from the Citizen Dashboard and clicking the 'Edit Complaint' button.";
    }

    // DELETE
    else if (
      userMessage.includes("delete") ||
      userMessage.includes("remove")
    ) {
      reply =
        "You can delete a complaint from the 'My Complaints' page by clicking the 'Delete Complaint' button.";
    }

    // CATEGORIES
    else if (
      userMessage.includes("category") ||
      userMessage.includes("categories") ||
      userMessage.includes("type of complaint")
    ) {
      reply =
        "Available complaint categories are Infrastructure, Public Safety, Sanitation, Utilities, and Other.";
    }

    // INFRASTRUCTURE
    else if (
      userMessage.includes("infrastructure") ||
      userMessage.includes("road") ||
      userMessage.includes("street")
    ) {
      reply =
        "Infrastructure complaints can include issues such as damaged roads, broken streetlights, public buildings, or other public facilities.";
    }

    // PUBLIC SAFETY
    else if (
      userMessage.includes("public safety") ||
      userMessage.includes("safety")
    ) {
      reply =
        "Public Safety complaints can include issues that may affect the safety and security of citizens in public areas.";
    }

    // SANITATION
    else if (
      userMessage.includes("sanitation") ||
      userMessage.includes("garbage") ||
      userMessage.includes("waste")
    ) {
      reply =
        "Sanitation complaints can include garbage collection problems, waste management, or cleanliness issues in public areas.";
    }

    // UTILITIES
    else if (
      userMessage.includes("utilities") ||
      userMessage.includes("electricity") ||
      userMessage.includes("water") ||
      userMessage.includes("gas")
    ) {
      reply =
        "Utility complaints can include issues related to electricity, water, gas, or other essential public services.";
    }

    // SUBMIT COMPLAINT
    else if (
      userMessage.includes("submit") ||
      userMessage.includes("create") ||
      userMessage.includes("new complaint") ||
      userMessage.includes("file a complaint")
    ) {
      reply =
        "To submit a complaint, go to the Citizen Dashboard and click 'Submit New Complaint'. Enter a title, description, and category, then click 'Submit Complaint'.";
    }

    // GENERAL HELP
    else if (
      userMessage.includes("help") ||
      userMessage.includes("what can you do")
    ) {
      reply =
        "I can help you understand how to submit complaints, check their status, edit or delete them, and understand the available complaint categories.";
    }

    // DEFAULT
    else {
      reply =
        "I'm not sure I understand that completely. I can help you with submitting a complaint, checking its status, editing or deleting complaints, and understanding complaint categories.";
    }

    res.status(200).json({
      reply,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error processing chatbot request",
      error: error.message,
    });
  }
});

module.exports = router;