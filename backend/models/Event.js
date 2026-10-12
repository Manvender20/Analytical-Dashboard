
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    session_id: {
      type: String,
      required: true,
      index: true,
    },

    event_type: {
      type: String,
      required: true,
      enum: ["page_view", "click"],
    },

    page_url: {
      type: String,
      required: true,
      trim: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },

    click: {
      x: {
        type: Number,
        min: 0,
      },
      y: {
        type: Number,
        min: 0,
      },
    },
  },
  {
    versionKey: false,
  }
);

eventSchema.index({ session_id: 1, timestamp: 1 });
eventSchema.index({ page_url: 1, event_type: 1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;
