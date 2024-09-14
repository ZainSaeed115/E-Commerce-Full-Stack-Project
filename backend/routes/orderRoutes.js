import express from "express";
import {verifyJwt,authorized} from "../middlewares/authMiddleware.js"
import 
{createOrder,
getAllOrders,
getUserOrders,
countTotalOrders,
calculateTotalSales,
calculateTotalSalesByDate,
findOrderById,
markOrderAsPaid,
markAsDelivered,
} from  "../controllers/orderController.js";


const router= express.Router();
router.route("/").post(verifyJwt,createOrder).get(verifyJwt,authorized,getAllOrders);
router.route("/mine").get(verifyJwt,getUserOrders);
router.route("/total-orders").get(verifyJwt,countTotalOrders,countTotalOrders);
router.route("/total-sales").get(verifyJwt,authorized,calculateTotalSales);
router.route("/total-sales-by-date").get(verifyJwt,authorized,calculateTotalSalesByDate);
router.route("/:_id").get(verifyJwt,findOrderById);
router.route("/:_id/pay").put(verifyJwt,markOrderAsPaid);
router.route("/:_id/deliver").put(verifyJwt,authorized,markAsDelivered)



export default router;