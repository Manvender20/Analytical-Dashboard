import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import eventRoutes from "./routes/events.js";
import sessionRoutes from "./routes/sessions.js";
import heatmapRoutes from "./routes/heatmap.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/events",eventRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/heatmap", heatmapRoutes);
app.get("/", (req,res)=>{
    res.json({
        message : "CasualFunnel API is running"
    });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try{
      await mongoose.connect(process.env.MONGODB_URI);

      console.log("Database connected successfully");

      app.listen(PORT,()=>{
       console.log("Server started successfully");
      });
    }catch(error){
       console.error("Failed to start server:", error.message);
       process.exit(1);
    }
}

startServer();