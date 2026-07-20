import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Utils service is running on ${PORT}.`);
});
