import express from "express";
import { isAuth, isSeller } from "../middlewares/isAuth.js";
import { assignedRiderToOrder, createOrder, fetchOrderforPayment, fetchRestaurantOrders, fetchRestaurantSales, fetchSingleOrder, getMyOrders, geyCurrentOrdersForRider, updateOrderStatus, updateOrderStatusRider } from "../controllers/order.js";

const router = express.Router();

router.get("/myorder",isAuth,getMyOrders);
router.get("/:id",isAuth,fetchSingleOrder);

router.post("/new",isAuth,createOrder);
router.get("/payment/:id",fetchOrderforPayment);
router.get("/restaurant/:restaurantId",isAuth,isSeller,fetchRestaurantOrders);
router.get("/restaurant/:restaurantId/sales",isAuth,isSeller,fetchRestaurantSales);
router.put("/:orderId",isAuth,isSeller,updateOrderStatus);
router.put("/assign/rider",assignedRiderToOrder);
router.get("/current/rider",geyCurrentOrdersForRider);
router.put("/update/status/rider",updateOrderStatusRider)

export default router;