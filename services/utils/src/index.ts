import express from "express";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import cors from "cors";
import uploadroutes from "./routes/cloudinary.js"

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb",extended: true}));

const {CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY} = process.env;

if(!CLOUDINARY_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_SECRET_KEY) {
    throw new Error("Missing the Cloudinary config.");
}

cloudinary.v2.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET_KEY
});

app.use("/api",uploadroutes);

const PORT = process.env.PORT || 5002;

app.listen(PORT,() => {
    console.log(`Utils service is running on ${PORT}.`);
})