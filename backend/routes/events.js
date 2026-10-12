
import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

// POST /api/events
router.post("/", async (req, res) => {
  try {
    const { session_id, event_type, page_url, click } = req.body;

    // 1. Validate required fields
    if (!session_id || !event_type || !page_url) {
      return res.status(400).json({
        success: false,
        message: "session_id, event_type and page_url are required",
      });
    }

    // 2. Validate event type
    if (!["page_view", "click"].includes(event_type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event_type",
      });
    }

    // 3. Validate the page URL
    try {
      const parsedUrl = new URL(page_url);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Unsupported protocol");
      }
    } catch {
      return res.status(400).json({
        success: false,
        message: "A valid HTTP or HTTPS page_url is required",
      });
    }

    // 4. Validate click coordinates
    if (event_type === "click") {
      if (
        !click ||
        !Number.isFinite(click.x) ||
        !Number.isFinite(click.y) ||
        click.x < 0 ||
        click.y < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Click events require valid non-negative x and y coordinates",
        });
      }
    }

    // 5. Create the event document
    const event = await Event.create({
      session_id,
      event_type,
      page_url,
      ...(event_type === "click" && { click }),
    });

    // 6. Send the response
    return res.status(201).json({
      success: true,
      message: "Event stored successfully",
      data: event,
    });
  } catch (error) {
    console.error("Event ingestion error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to store event",
    });
  }
});

export default router;
