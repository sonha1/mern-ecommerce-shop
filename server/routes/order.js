import express from 'express';
import {
  newOrder,
  getSingleOrderA,
  getSingleOrderU,
  getAllOrders,
} from '../controllers/orderController.js';
import {
  isAuthenticatedUser,
  checkRole,
} from '../middlewares/auth.js';
const routes = express.Router();
routes.post('/new', isAuthenticatedUser, newOrder);
routes.get(
  '/admin/all',
  isAuthenticatedUser,
  checkRole('admin'),
  getAllOrders
);
routes.get(
  '/:id',
  isAuthenticatedUser,
  checkRole('admin'),
  getSingleOrderU
);

export default routes;
