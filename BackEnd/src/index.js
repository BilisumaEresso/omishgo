import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import connectDB from "./config/mongoDb.js";

// DB connection
connectDB();

const PORT = process.env.PORT || 5000;

// server hosting
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));

// Don't let an unhandled promise rejection or a stray thrown error take
// the process down silently — log it so it shows up wherever morgan/stdout
// is being collected, rather than the server just vanishing.
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
