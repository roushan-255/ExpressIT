import express from "express";
import authRoutes from "./route/auth.route.js";
import userRoutes from "./route/user.route.js";
import postRoutes from "./route/post.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";

import { config } from "dotenv";

config();

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1/posts", postRoutes);

app.all("*", (req, res) => {
  res.status(404).json("OOPS! Page Not Found");
});

app.use(errorMiddleware);

export default app;
