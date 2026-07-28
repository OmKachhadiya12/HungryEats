import axios from "axios";
import { Request, Response } from "express";
import { razorpay } from "../config/razorpay.js";
import { verifyRazorpaySignature } from "../config/verifyRazorpay.js";
import { publishPaymentSuccess } from "../config/payment.producer.js";

const createRazorpayOrder = async (req:Request,res:Response) => {
    try {

        const { orderId } = req.body;

        const { data } = await axios.get(
            `${process.env.RESTAURANT_SERVICE}/api/order/payment/${orderId}`,
            {
                headers: {
                    "x-internal-key": process.env.INTERNAL_SERVICE_KEY, 
                }
            },
        )

        const razorpayOrder = await razorpay.orders.create({
            amount: data.amount * 100,
            currency: "INR",
            receipt: orderId,
        })

        res.json({
            razorpayOrder: razorpayOrder.id,
            key: process.env.RAZORPAY_KEY_ID
        })
        
    } catch (error) {

        res.status(500).json({
            message: "Error in the Razorpay ordering."
        })
        
    }
};

const verifyRazorPayment = async (req:Request,res:Response) => {
    try {

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        const isValid = verifyRazorpaySignature( razorpay_order_id,razorpay_payment_id,razorpay_signature);

        if(!isValid) {
            return res.status(400).json({
                message: "Payment verification failed."
            })
        }

        await publishPaymentSuccess({orderId, paymentId: razorpay_payment_id, provider: "razorpay"});

        res.json({
            message: "Payment verified successfully",
        });
        
    } catch (error) {

        res.status(500).json({
            message: "Error in the Verifying Razorpay Payment."
        })
        
    }
}

export { createRazorpayOrder, verifyRazorPayment };