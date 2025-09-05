// models/Order.js
import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  paymentId: String,
  orderId: String,
  amount: Number,
  restaurantId: String,
  restaurantName: String,
  foodId: String,
  foodName: String,
  additives: [String],
  deliveryAddress: {
    line1: String,
    postalCode: String,
  },
  createdAt: Date,
});

export default model('Order', orderSchema);