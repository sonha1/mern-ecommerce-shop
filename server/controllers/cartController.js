import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHander.js";
import Cart from "../models/Cart.js";
import Product from "../models/product.js";
export const addItemToCart = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  const { quantity } = req.body.quantity;
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  const userCart = await Cart.find({
    user: req.user._id,
  });
  if (userCart) {
    userCart.cartItems.forEach((prod) => {
      if (prod.productDetails.product === req.params.id) {
        prod.productDetails.quantity += quantity;
      } else {
        userCart.cartItems.push({
          product: req.params.id,
          quantity: quantity,
        });
      }
    });
    await userCart.save({ validateBeforeSave: false });
  } else {
    await Cart.create({
      cartItems: [
        {
          productDetails: {
            product: req.params.id,
            quantity: quantity,
          },
        },
      ],
      user: req.user._id,
    });
  }
  res.status(200).json({ success: true, product });
});
