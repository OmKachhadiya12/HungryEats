import express from "express"
import { createRazorpayOrder, verifyRazorPayment } from "../controllers/payment.js";

const router = express.Router();

router.post("/create",createRazorpayOrder);
router.post("/verify",verifyRazorPayment);

export default router;