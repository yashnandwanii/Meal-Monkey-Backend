import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Restaurant from '../models/restaurent.model.js';

// Restaurant Login
export const loginRestaurant = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find restaurant by email
        const restaurant = await Restaurant.findOne({ email });
        if (!restaurant) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
                code: "INVALID_CREDENTIALS"
            });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, restaurant.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
                code: "INVALID_CREDENTIALS"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: restaurant._id, role: 'restaurant' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return success response
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                restaurant: {
                    id: restaurant._id,
                    name: restaurant.name,
                    email: restaurant.email,
                    imageUrl: restaurant.imageUrl,
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "An error occurred during login",
            code: "SERVER_ERROR"
        });
    }
};

// Restaurant Registration
export const registerRestaurant = async (req, res) => {
    try {
        const { name, email, password, imageUrl } = req.body;

        // Check if restaurant already exists
        const existingRestaurant = await Restaurant.findOne({ email });
        if (existingRestaurant) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
                code: "EMAIL_EXISTS"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new restaurant
        const restaurant = new Restaurant({
            name,
            email,
            password: hashedPassword,
            imageUrl
        });

        await restaurant.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: restaurant._id, role: 'restaurant' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return success response
        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: {
                token,
                restaurant: {
                    id: restaurant._id,
                    name: restaurant.name,
                    email: restaurant.email,
                    imageUrl: restaurant.imageUrl,
                }
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: "An error occurred during registration",
            code: "SERVER_ERROR"
        });
    }
};
