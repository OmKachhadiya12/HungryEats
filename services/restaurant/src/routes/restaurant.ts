import express from "express";
import { addRestaurant } from "../controllers/restaurant.js";
import { isAuth, isSeller } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/new",isAuth,isSeller,addRestaurant);

export default router;