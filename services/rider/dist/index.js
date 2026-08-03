import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
    console.log(`Rider service is running on ${PORT}.`);
    connectDB();
});
