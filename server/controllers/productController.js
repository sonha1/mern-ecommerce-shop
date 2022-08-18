import Product from "../models/product.js";
// import errorMiddleware from './middlewares/error.js';
import ErrorHandler from "../utils/errorHander.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import ApiFeatures from "../utils/apiFeatures.js";
//  get all products
export const getAllProducts = catchAsyncError(async (req, res, next) => {
  // console.log(req.query);
  const resultPerPage = 8;
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  const products = await apiFeatures.query;
  const filteredProductCount = products.length;
  apiFeatures.pagination(resultPerPage);
  res.status(200).json({
    success: true,
    products,
    filteredProductCount,
    resultPerPage,
  });
});

//  create product --- only admin
export const createProduct = catchAsyncError(async (req, res) => {
  console.log(req.body);
  const data = req.body;

  const product = await Product.create(data);
  res.status(200).json({
    success: true,
    product,
  });
});

// get product by id
export const getProduct = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
  });
  res.status(200).json({ success: true, product });
};
//update product
export const updateProduct = async (req, res, next) => {
  let product = await Product.findOne({
    _id: req.params.id,
  });
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true, product });
};

export const deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await product.remove();
  res.status(200).json({ success: true, product });
};

export const createReviewProduct = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  // check xem user da co rv vs prod nay chua
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  // rate tong so rate/ so rev
  product.reviews.forEach((review) => {
    avg += review.rating;
  });
  product.rating = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({ success: true });
});

export const getAllReviews = catchAsyncError(async (req, res, next) => {
  const products = await Product.findById(req.query.id);
  if (!products) {
    return next(new ErrorHandler("product not found", 400));
  }
  res.status(200).json({ success: true, reviews: products.reviews });
});
export const deleteReviewProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("product not found", 400));
  }
  let avg = 0;

  // giu cac id khac vs id query cuar rev can xoa
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );
  let rating = 0;
  if (reviews.length === 0) {
    rating = 0;
  } else {
    rating = avg / reviews.length;
  }
  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, rating, numOfReviews },
    {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    }
  );
  res.status(200).json({ success: true });
});
export const getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find({});
  res.status(200).json({ success: true, products });
});
