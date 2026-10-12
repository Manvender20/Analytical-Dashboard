
import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

// GET /api/heatmap/pages
router.get("/pages", async (req, res) => {
  try {
    const pages = await Event.distinct("page_url");

    res.status(200).json({
      success: true,
      count: pages.length,
      data: pages
    });
  } catch (error) {
    console.error("Fetch heatmap pages error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch pages"
    });
  }
});

// GET /api/heatmap/clicks?pageUrl=...
router.get("/clicks", async (req, res) => {
  try {
    const { pageUrl } = req.query;

    if (!pageUrl || typeof pageUrl !== "string") {
      return res.status(400).json({
        success: false,
        message: "pageUrl query parameter is required"
      });
    }

    const clicks = await Event.find({
      page_url: pageUrl,
      event_type: "click",
      "click.x": { $exists: true },
      "click.y": { $exists: true }
    })
      .select("session_id page_url timestamp click")
      .sort({ timestamp: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: clicks.length,
      data: clicks
    });
  } catch (error) {
    console.error("Fetch heatmap clicks error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch click data"
    });
  }
});

export default router;
