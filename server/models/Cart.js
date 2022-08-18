import mongoose from 'mongoose';

const CartSchema = mongoose.Schema(
  {
    cartItems: [
      {
        productDetails: {
          product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: true,
          },
          quantity: { type: Number, required: true },
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamp: true }
);

export default mongoose.model('cart', CartSchema);
