import cors from "cors";
import express from "express";
import helmet from "helmet";
import errorMiddleware from "./middleware/error.middleware.js";
import notFoundMiddleware from "./middleware/notFound.middleware.js";
import adminRouter from "./modules/admin/admin.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import messageRouter from "./modules/messages/message.routes.js";
import notificationRouter from "./modules/notification/notification.routes.js";
import orderRouter from "./modules/order/order.routes.js";
import productRouter from "./modules/product/product.routes.js";
import savedRouter from "./modules/saved/saved.routes.js";
import uploadRouter from "./modules/upload/upload.routes.js";
import userRouter from "./modules/user/user.routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
// check the server
app.get("/", (req, res) => {
  res.send("OmishGo is running !!");
});
// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/saved", savedRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/users", userRouter);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
