import express from "express";
import { createRazorpayOrder, payWithStripe, verifyRazorPayment, verifyStripe } from "../controllers/payment.js";
const router = express.Router();
router.post("/create", createRazorpayOrder);
router.post("/verify", verifyRazorPayment);
router.post("/stripe/create", payWithStripe);
router.post("/stripe/verify", verifyStripe);
export default router;
