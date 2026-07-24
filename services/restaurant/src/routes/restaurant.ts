import express from "express";
import { addRestaurant, fetchMyrestaurant, updateStatusRestaurant, updateRestaurant, getNearbyRestaurant, fetchSingleRestaurant } from "../controllers/restaurant.js";
import { isAuth, isSeller } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

router.post("/new",isAuth,isSeller,uploadFile,addRestaurant);
router.get("/my",isAuth,isSeller,fetchMyrestaurant);
router.put("/status", isAuth, isSeller, updateStatusRestaurant);
router.put("/edit", isAuth, isSeller, updateRestaurant);
router.get("/all",isAuth,getNearbyRestaurant);
router.get("/:id",isAuth,fetchSingleRestaurant);

export default router;