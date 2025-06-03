import express from 'express';
import orderController from '../controllers/order.controller.js';
import { verifyTokenAndAuthorization } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/', verifyTokenAndAuthorization, orderController.placeOrder);
router.get('/', verifyTokenAndAuthorization, orderController.getUserOrders);


export default router;