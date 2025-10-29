import Order from '../models/order.model.js';

const placeOrder = async(req, res) => {
    const newOrder = new Order({
        ...req.body,
        userId: req.user.id,   
    });
    try {
        await newOrder.save();
        const orderId = newOrder._id;

        
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderId: orderId
        });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: error.message
        });
    }
}

const getUserOrders = async(req, res) => {
    const userId = req.user.id;
    const {paymentStatus, orderStatus} = req.query;

    let query = { userId: userId };
    if (paymentStatus) {
        query.paymentStatus = paymentStatus;
    }

    if (orderStatus) {
        query.orderStatus = orderStatus;
    }

    try {
        const orders = await Order.find(query).populate({
            path:'orderItems.foodId',
            select: 'title time imageUrl rating',
        });
        res.status(200).json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
}

export default {
    placeOrder,
    getUserOrders
};