import cors from "cors";
import express from "express";
import helmet from "helmet";
import errorMiddleware from "./middleware/error.middleware.js";
import notFoundMiddleware from "./middleware/notFound.middleware.js";
import authRouter from "./modules/auth/auth.routes.js";
import roleRouter from "./modules/roles/role.routes.js";
import { refreshToken } from "./modules/auth/auth.controller.js";

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
app.use("/api/v1/roles", roleRouter);
app.post("/auth/refresh-token", refreshToken);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
