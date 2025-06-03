import User from '../models/user.model.js';

const getUser = async (req, res) => {
    try{
        const user = await User.findById(req.user.id)
        .select("-password -otp -__v -createdAt "); // Exclude sensitive fields
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        return res.status(200).json({ status: true, user });

    }
    catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

const verifyUser = async (req, res) => {
    const userOtp = req.params.otp;

    if (!userOtp) {
        return res.status(400).json({ status: false, message: "OTP is required" });
    }

    try {
        const user = await User.findById(req.user.id); 
        console.log("User found:", user);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        if (user.otp !== userOtp) {
            return res.status(400).json({ status: false, message: "Invalid OTP" });
        }
        // Update user verification status
        user.verification = true;
        user.otp = null; // Clear OTP after verification
        await user.save();
        res.status(200).json({ status: true, message: "User verified successfully", user });
    }
    catch (error) {
        console.error("Error verifying user:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

const verifyPhone = async (req, res) => {
    const userPhone = req.params.phone;

    if (!userPhone) {
        return res.status(400).json({ status: false, message: "Phone number is required" });
    }

    try {
        const user = await User.findById(req.user.id)
             // Fetch only the phone field
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        // Update user verification status
        user.phoneVerification = true;
        user.phone = userPhone; // Set the phone number
        await user.save();
        const { password, otp, createdAt, ...others } = user._doc; // Exclude sensitive fields
        return res.status(200).json({ ...others });
    }
    catch (error) {
        console.error("Error verifying phone number:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        return res.status(200).json({ status: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}


export default {
    getUser,
    verifyUser,
    verifyPhone,
    deleteUser
};
