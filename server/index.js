import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import errorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.js";
import productRouter from "./routes/product.js";
import orderRouter from "./routes/order.js";
import cartRouter from "./routes/cart.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("error connecting to DB");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/cart", cartRouter);
app.use(errorMiddleware);
app.listen(port, () => console.log("http://localhost:" + port));
