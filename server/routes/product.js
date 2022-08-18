import express from 'express';
import {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  createReviewProduct,
  deleteReviewProduct,
  getAllReviews,
  getAdminProducts,
} from '../controllers/productController.js';
import {
  isAuthenticatedUser,
  checkRole,
} from '../middlewares/auth.js';
const router = express.Router();

router.get('/', getAllProducts);
router.get(
  '/admin/all',
  isAuthenticatedUser,
  checkRole('admin'),
  getAdminProducts
);

router.post(
  '/admin/create',
  isAuthenticatedUser,
  checkRole('admin'),
  createProduct
);
router.put(
  '/admin/update/:id',
  isAuthenticatedUser,
  checkRole('admin'),
  updateProduct
);
router.delete(
  '/admin/delete/:id',
  isAuthenticatedUser,
  checkRole('admin'),
  deleteProduct
);
router.post(
  '/review/new',
  isAuthenticatedUser,
  createReviewProduct
);
router.delete(
  '/review',
  isAuthenticatedUser,
  checkRole('admin'),
  deleteReviewProduct
);
router.get(
  '/review',
  isAuthenticatedUser,
  checkRole('admin'),
  getAllReviews
);

router.get('/:id', getProduct);
export default router;
