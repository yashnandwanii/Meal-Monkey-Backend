import User from '../models/user.model.js';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import generateOTP  from '../utils/otp_generator.js';
import sendEmail from '../utils/smtp_function.js';
import validator from 'validator';



const createUser = async (req, res) => {
    const emailRegex = /^[a-zA-Z0-9._-}+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if(!emailRegex.test(req.body.email)) {
        return res.status(400).json({ status:false, message: "Invalid email format" });
    }
    
    const minPasswordLength = 8;
    if(req.body.password.length < minPasswordLength) {
        return res.status(400).json({ status:false, message: `Password must be at least ${minPasswordLength} characters long` });
    }

    try {
        const emailExists = await User.findOne({email: req.body.email});
        if (emailExists) {
            return res.status(400).json({ status: false, message: "Email already exists" });
        }

        const otp = generateOTP();
        const hashedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString();
        //console.log("Hashed Password:", hashedPassword);

        const newUser = new User({
            username: req.body.username?? "none",    
            name: req.body.name,
            email: req.body.email,
            userType: "Client",
            password: hashedPassword,
            //phone: req.body.phone,
            otp: otp
        })
        await newUser.save();

        sendEmail(newUser.email, otp);
        return res.status(201).json({ status: true, message: "User created successfully"});
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

const loginUser = async(req,res)=>{

    const email = req.body.email ? req.body.email.trim() : '';

    if (!validator.isEmail(email)) {
        return res.status(400).json({ status: false, message: "Invalid email format" });
    }
    
    const minPasswordLength = 8;
    if(req.body.password < minPasswordLength) {
        return res.status(400).json({ status:false, message: `Password must be at least ${minPasswordLength} characters long` });
    }

    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET);

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if (originalPassword !== req.body.password) {
            return res.status(400).json({ status: false, message: "Invalid password" });
        }

        const token = jwt.sign(
            { 
            id: user._id,
            userType:user.userType,
            email: user.email,
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '21d' }
        );

        const { password, otp, createdAt, updatedAt, __v, ...others} = user._doc; 

        return res.status(200).json({ ...others, token});
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
        
    }
}



export default {
    createUser,
    loginUser
};