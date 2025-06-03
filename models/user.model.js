import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        default:"none"
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    verification:{
        type: Boolean,
        default: false,
    },
    phone:{
        type: String,
        default:"1234567890"
    },
    phoneVerification:{
        type: Boolean,
        default: false,
    },
    address:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Address",
        required: false,
    },
    userType: {
        type: String,
        required: true,
        enum: ["Client", "Admin", "Vendor", "Driver"],
        default: "Client",
    },
    profile:{
        type:String,
        default:"https://d326nfutv7b1e.cloudfront.net/uploads/edb6a2e4-d94d-4b00-92f0-0c37bca2f39d-vinci_03.jpg",
    }
}, {
    timestamps: true,});
const User = mongoose.model("User", userSchema);
export default User;