import express from 'express';
import foodController from '../controllers/food.controller.js';
import { verifyVendorToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/', verifyVendorToken, foodController.addFood);
router.get('/:id', foodController.getFoodById);
router.get('/random/:code', foodController.getRandomFoods);
router.get('/search/:search', foodController.searchFoods);
router.get('/bycode/:code', foodController.getAllFoodsByCode);
router.get('/recommendation/:code', foodController.getRandomFoods);
router.get('/restaurent-foods/:id', foodController.getFoodsByRestaurent);
router.get('/:category/:code', foodController.getFoodsByCategoryAndCode);



export default router;