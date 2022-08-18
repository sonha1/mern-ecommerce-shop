import ErrorHandler from "../utils/errorHander.js";
import User from "../models/User.js";
import cloudinary from "cloudinary";
import sendToken from "../utils/sendToken.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// post /api/user/register
export const register = catchAsyncError(async (req, res, next) => {
  // const myCloud = await cloudinary.v2.uploader.upload(
  //   req.body.avatar,
  //   {
  //     folder: 'avatars',
  //     width: 150,
  //     crop: 'scale',
  //   }
  // );
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "req.body.avatar.public_id",
      url: "req.body.avatar.url",
    },
  });
  sendToken(user, 201, res);
});
// post /api/user/login
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("please enter Email and Password", 400));
  }
  const user = await User.findOne({
    email: email,
  }).select("+password");

  if (!user) {
    return next(new ErrorHandler("email or password is not correct", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("invalid email or password", 401));
  }
  sendToken(user, 200, res);
});
export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged Out",
    });
});
// post /api/user/password/forget
export const forgetPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new ErrorHandler("email is not valid", 401));
  }
  // get token reset
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}//password/reset/${resetToken}`;

  const message = ` Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: `Ecommerce Password Recovery`,
    //   message,
    // });
    res.status(200).json({
      success: true,
      message: resetToken,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(err.message, 500));
  }
});
// put /api/user/password/reset/:token
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler("token is not valid or has been expired", 500)
    );
  }
  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("password is not match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();
  sendToken(user, 200, res);
});
// post /api/user/password/update
export const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("old password is not matched", 400));
  }
  if (req.body.newPassword != req.body.confirmPassword) {
    return next(new ErrorHandler("password is not match", 400));
  }
  user.password = req.body.newPassword;

  await user.save();
  sendToken(user, 200, res);
});

// get /api/user/:id
export const getDetailUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(
      new ErrorHandler(`user does not exist with id: ${req.params.id}`, 400)
    );
  res.status(200).json({ success: true, user });
});
// get /api/user/admin/get/:id -- admin
export const getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(
      new ErrorHandler(`user does not exist with id: ${req.params.id}`, 400)
    );
  res.status(200).json({ success: true, user });
});
// get /api/user/admin/all
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({ success: true, users });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;
  await User.findByIdAndUpdate(
    { _id: req.user._id },
    { name: name, email: email }
  );
  res.status(200).json({ success: true });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("can't find user with id ", 404));
  }
  await user.remove();
  res.status(200).json({ success: true });
});
const refreshTokenArr = [];
export const refreshToken = catchAsyncError(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new ErrorHandler("please login", 404));
  }
  if (refreshTokenArr.includes(refreshToken)) {
    return next(new ErrorHandler("token is not valid", 400));
  }
  jwt.verify(
    refreshToken,
    process.env.JWT_SECRET_REFRESH_TOKEN,
    async (err, id) => {
      const user = await User.findById(id);
      refreshTokenArr.push(refreshToken);
      sendToken(user, 200, res);
    }
  );
});
