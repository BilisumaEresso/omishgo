import cors from "cors";
import express from "express";
import helmet from "helmet";
import errorMiddleware from "./middleware/error.middleware.js";
import notFoundMiddleware from "./middleware/notFound.middleware.js";
import authRouter from "./modules/auth/auth.routes.js";
import adminRouter from "./modules/admin/admin.routes.js";
import productRouter from "./modules/product/product.routes.js";
import chatRouter from "./modules/chat/chat.routes.js";

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
app.use("/api/v1/messages", chatRouter);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
