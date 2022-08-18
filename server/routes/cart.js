import express from 'express';
import { addItemToCart } from '../controllers/cartController.js';
import { isAuthenticatedUser } from '../middlewares/auth.js';

const route = express.Router();
route.post('/add/:id', isAuthenticatedUser, addItemToCart);

export default route;
