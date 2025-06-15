import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  additives: {
    type: [String],
    default: [],
  },
  instructions: {
    type: String,
    default: "",
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [orderItemSchema],
    orderTotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    restaurantAddress: {
      type: String,
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "Placed",
        "Preparing",
        "Manual",
        "Delivered",
        "Cancelled",
        "Ready",
        "Out_for_Delivery",
      ],
      default: "Pending",
    },
    restaurantCoords: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
    recipientCoords: {
      type: [Number],
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    feedback: {
      type: String,
    },
    promoCode: {
      type: String,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;