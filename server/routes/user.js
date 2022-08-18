import express from 'express';
import {
  register,
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
  getDetailUser,
  logout,
  updateProfile,
  getAllUsers,
  deleteUser,
} from '../controllers/userController.js';
import {
  isAuthenticatedUser,
  checkRole,
} from '../middlewares/auth.js';
const router = express.Router();
// /api/v1/user/
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/password/forget', forgetPassword);
router.put('/password/reset/:token', resetPassword);
router.get('/me', isAuthenticatedUser, getDetailUser);
router.put(
  '/password/update',
  isAuthenticatedUser,
  updatePassword
);
router.put(
  '/profile/update',
  isAuthenticatedUser,
  updateProfile
);
router.get(
  '/admin/all',
  isAuthenticatedUser,
  checkRole('admin'),
  getAllUsers
);
router.delete(
  '/admin/delete/:id',
  isAuthenticatedUser,
  checkRole('admin'),
  deleteUser
);

router.get('/:id', isAuthenticatedUser, getDetailUser);
export default router;
