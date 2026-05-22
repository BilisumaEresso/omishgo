import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const isAuth = (req, res, next) => {
  // 1. Get the Authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // 2. Check if the header exists and follows the 'Bearer <token>' pattern
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Access denied. No token provided."));
  }

  // 3. Extract the actual token string
  const token = authHeader.split(" ")[1];

  try {
    // 4. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Assign the decoded user data to the request object
    req.user = decoded;

    // 6. Pass control to the next middleware or router handler
    next();
  } catch (error) {
    // 7. Handle specific JWT errors gracefully
    let message = "Invalid token.";
    if (error.name === "TokenExpiredError") {
      message = "Token has expired.";
    }
    next(new ApiError(401, message));
  }
};

export default isAuth;
