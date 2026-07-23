import express from "express";
import { addRestaurant, fetchMyrestaurant, updateStatusRestaurant, updateRestaurant } from "../controllers/restaurant.js";
import { isAuth, isSeller } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

router.post("/new",isAuth,isSeller,uploadFile,addRestaurant);
router.get("/my",isAuth,isSeller,fetchMyrestaurant);
router.put("/status", isAuth, isSeller, updateStatusRestaurant);
router.put("/edit", isAuth, isSeller, updateRestaurant);

export default router;