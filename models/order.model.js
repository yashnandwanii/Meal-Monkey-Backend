import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
    },
    quantity: {
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    additives: {
        type: Array,
        default: []
    },
    instructions:{
        type: String,
        default: ""
    }
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    orderItems: [orderItemSchema],
    orderTotal:{
        type: Number,
        required: true
    },
    deliveryFee:{
        type: Number,
        required: true
    },
    grandTotal:{
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },  
    restaurentAddress:{
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending"
    },
    orderStatus: {
        type: String,
        enum: ["Placed", "Preparing", "Manual", "Delivered", "Cancelled", "Ready", "Out_for_Delivery",
        ],
        default: "Pending"
    },  
    restaurentCoords:[Number],
    recipientCoords:[Number],
    driverId:{
        type:String,
        default:''
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        default:3
    },
    feedback:{
        type:String,
    },
    promocode:{
        type:String,
    },
    discountAmount:{
        type:Number,
    },
    notes:{
        type:String,
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;