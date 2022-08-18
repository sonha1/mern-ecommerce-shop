import catchAsyncError from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../utils/errorHander.js';
import Order from '../models/Order.js';
import Product from '../models/product.js';

//post /api/order/new
export const newOrder = catchAsyncError(
  async (req, res, next) => {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
    console.log(req.user);
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user,
    });
    res.status(200).json({ success: true, order });
  }
);
// get single order with user get /api/order/:id
export const getSingleOrderU = catchAsyncError(
  async (req, res, next) => {
    const order = await Order.find({
      _id: req.params.id,
      user: req.user._id,
    }).populate('user', 'name email');

    if (!order) {
      return next(
        new ErrorHandler(
          'Order not found with this Id',
          404
        )
      );
    }
    res.status(200).json(order);
  }
);
export const getSingleOrderA = catchAsyncError(
  async (req, res, next) => {
    const order = await Order.findById(
      req.params.id
    ).populate('user', 'name email');

    if (!order) {
      return next(
        new ErrorHandler(
          'Order not found with this Id',
          404
        )
      );
    }
    res.status(200).json(order);
  }
);

export const getAllOrders = catchAsyncError(
  async (req, res, next) => {
    const orders = await Order.find({}).populate(
      'user',
      'name email'
    );
    res.status(200).json(orders);
  }
);

const updateStock = async (id, quantity) => {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await Product.save({ validateBeforeSave: false });
};

export const updateOrder = catchAsyncError(
  async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order)
      return next(
        new ErrorHandler(
          'Order not found with this id ',
          404
        )
      );
    if (order.orderStatus === 'Delivered') {
      return next(
        new ErrorHandler('you have already this order', 400)
      );
    }
    if (order.orderStatus === 'Shipped') {
      order.orderItems.forEach(
        async (item) =>
          await updateStock(i.product, i.quantity)
      );
    }
    order.orderStatus = req.body.status;
    if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({ success: true });
  }
);
