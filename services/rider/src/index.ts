import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import riderRoutes from "./routes/rider.js"

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/rider",riderRoutes);

const PORT = process.env.PORT || 5004;

app.listen(PORT,() => {
    console.log(`Rider service is running on ${PORT}.`);
    connectDB();
})