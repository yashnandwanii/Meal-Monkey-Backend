import express from 'express';
import paymentController from '../controllers/payment.controller.js';
import { verifyTokenAndAuthorization } from '../middlewares/verifyToken.js';

const router = express.Router();

// Create order and get Razorpay order ID
router.post('/create-order', verifyTokenAndAuthorization, paymentController.createOrder);

// Verify payment after Razorpay payment success
router.post('/verify', verifyTokenAndAuthorization, paymentController.verifyPayment);

export default router;
