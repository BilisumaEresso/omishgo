import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import connectDB from "./config/mongoDb.js";

// DB connection
connectDB();

// server hosting
app.listen(process.env.PORT, () =>
  console.log(`Server running at port ${process.env.PORT}`),
);
