import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
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

// CORS: allowlist driven by CORS_ORIGINS (comma-separated), not a blanket
// cors() which reflects any origin back. In development, with no
// CORS_ORIGINS set, fall back to allowing all so local Expo/Vite dev
// servers on random ports aren't blocked — but this must be set in any
// deployed environment (see .env.example).
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header at all (native app requests, curl, Postman) — allow.
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) {
        // Nothing configured: permissive in dev, but warn so it's not
        // mistaken for an intentional production setting.
        if (process.env.NODE_ENV === "production") {
          console.warn(
            "CORS_ORIGINS is not set in production — rejecting browser origin:",
            origin,
          );
          const corsError = new Error("Not allowed by CORS");
          corsError.statusCode = 403;
          return callback(corsError);
        }
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) return callback(null, true);
      const corsError = new Error("Not allowed by CORS");
      corsError.statusCode = 403;
      return callback(corsError);
    },
  }),
);

app.use(helmet());

// HTTP request logging. Quiet in tests so it doesn't clutter `npm test`
// output; concise 'dev' format locally; standard 'combined' format (closer
// to Apache/NCSA log format, useful if piped into a log aggregator) in
// production.
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// Plain landing route — kept for anyone hitting the root in a browser.
app.get("/", (req, res) => {
  res.send("OmishGo is running !!");
});

// Real health check: reports process uptime and DB connection state, so
// an uptime monitor (or a human) can tell the difference between "server
// process is up but DB is down" and "actually healthy". Also doubles as
// the keep-awake ping for Render's free tier (see MVP doc Section 11).
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  const dbConnected = dbState === 1;

  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    status: dbConnected ? "ok" : "degraded",
    uptimeSeconds: Math.round(process.uptime()),
    db: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
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
