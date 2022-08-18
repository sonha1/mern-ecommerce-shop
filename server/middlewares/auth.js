import catchAsyncError from './catchAsyncError.js';
import ErrorHandler from '../utils/errorHander.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const isAuthenticatedUser = catchAsyncError(
  async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    console.log(accessToken);
    if (!accessToken) {
      return next(
        new ErrorHandler(
          'Please Login to access this resource ',
          401
        )
      );
    }
    const decodedData = jwt.verify(
      accessToken,
      process.env.JWT_SECRET
    );
    req.user = await User.findById(decodedData.id);

    next();
  }
);
export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource `,
          403
        )
      );
    }
    next();
  };
};
