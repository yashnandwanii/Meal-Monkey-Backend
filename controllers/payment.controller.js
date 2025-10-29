import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_TEST_SECRET'
});

// Create order and Razorpay order
const createOrder = async (req, res) => {
    try {
        const {
            userId,
            restaurantId,
            restaurantName,
            orderItems,
            orderTotal,
            deliveryFee,
            grandTotal,
            deliveryAddressId,
            deliveryAddress,
            restaurantCoords,
            recipientCoords,
            notes,
            currency = 'INR'
        } = req.body;

        console.log('Creating order for user:', userId);
        console.log('Grand total:', grandTotal);

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(grandTotal * 100), // Amount in paise
            currency: currency,
            receipt: `order_${Date.now()}`,
            notes: {
                userId,
                restaurantId,
                restaurantName,
                orderType: 'food_delivery'
            }
        });

        console.log('Razorpay order created:', razorpayOrder.id);

        // Return order details with Razorpay info
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                orderId: razorpayOrder.receipt,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
                orderDetails: {
                    userId,
                    restaurantId,
                    restaurantName,
                    orderItems,
                    orderTotal,
                    deliveryFee,
                    grandTotal,
                    deliveryAddressId,
                    deliveryAddress,
                    restaurantCoords,
                    recipientCoords,
                    notes
                }
            }
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
};

// Verify payment
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderDetails
        } = req.body;

        console.log('Verifying payment...');
        console.log('Order ID:', razorpay_order_id);
        console.log('Payment ID:', razorpay_payment_id);

        // Create signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_TEST_SECRET')
            .update(sign.toString())
            .digest('hex');

        // Verify signature
        if (razorpay_signature === expectedSign) {
            console.log('Payment verified successfully');

            // Here you would save the order to database
            // For now, we'll just return success
            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                data: {
                    paymentId: razorpay_payment_id,
                    orderId: razorpay_order_id,
                    verified: true
                }
            });
        } else {
            console.log('Payment verification failed - invalid signature');
            res.status(400).json({
                success: false,
                message: 'Payment verification failed',
                error: 'Invalid signature'
            });
        }

    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification error',
            error: error.message
        });
    }
};

export default {
    createOrder,
    verifyPayment
};
