
import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

// GET /api/sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: "$session_id",
          totalEvents: { $sum: 1 },
          pageViews: {
            $sum: {
              $cond: [
                { $eq: ["$event_type", "page_view"] },
                1,
                0
              ]
            }
          },
          clicks: {
            $sum: {
              $cond: [
                { $eq: ["$event_type", "click"] },
                1,
                0
              ]
            }
          },
          lastActivity: { $max: "$timestamp" }
        }
      },
      {
        $sort: { lastActivity: -1 }
      },
      {
        $project: {
          _id: 0,
          session_id: "$_id",
          totalEvents: 1,
          pageViews: 1,
          clicks: 1,
          lastActivity: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    console.error("Fetch sessions error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions"
    });
  }
});

// GET /api/sessions/:id/events
router.get("/:id/events", async (req, res) => {
  try {
    const events = await Event.find({
      session_id: req.params.id
    })
      .sort({ timestamp: 1, _id: 1 })
      .select("-__v")
      .lean();

    res.status(200).json({
      success: true,
      session_id: req.params.id,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error("Fetch session events error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch session events"
    });
  }
});

export default router;
