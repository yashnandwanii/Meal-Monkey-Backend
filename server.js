import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import categoryRoutes from './routes/category.route.js';
import RestaurentRoutes from './routes/restaurent.route.js'; 
import FoodRoutes from './routes/food.route.js';
import RatingRoutes from './routes/rating.route.js';
import AuthRoutes from './routes/auth.route.js';
import UserRoutes from './routes/user.route.js';
import AddressRoutes from './routes/address.route.js'; 
import CartRoutes from './routes/cart.route.js'; 
import OrderRoutes from './routes/order.route.js';

const app = express();

dotenv.config();

mongoose.connect(process.env.MONGOURI)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", AuthRoutes); 
app.use("/api/users", UserRoutes); 
app.use("/api/category", categoryRoutes);  
app.use("/api/restaurent", RestaurentRoutes);
app.use("/api/food", FoodRoutes);
app.use("/api/rating", RatingRoutes);
app.use("/api/address", AddressRoutes); 
app.use("/api/cart", CartRoutes); 
app.use("/api/orders", OrderRoutes);



const port = process.env.PORT || 3000;



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});