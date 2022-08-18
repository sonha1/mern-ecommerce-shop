import mongoose from "mongoose";
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter product name"],
    },
    description: {
      type: String,
      required: [true, "please enter description"],
    },
    price: {
      type: Number,
      required: [true, "please enter price"],
      maxLength: [8, "price cannot exceed 8 characters"],
    },
    rating: {
      type: Number,
      // required: [true, 'please enter rating'],
      default: 0,
    },
    image: {
      public_id: {
        type: String,
        // required: true,
      },
      url: {
        type: String,
        // required: true,
      },
    },
    category: {
      type: String,
      required: [true, "please enter Product category"],
    },
    stock: {
      type: Number,
      required: [true, "please enter Product Stock"],
      maxLength: [4, "stock cannot exceed 4 characters"],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamp: true }
);
export default mongoose.model("product", productSchema);
