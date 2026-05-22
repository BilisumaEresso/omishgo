import sendResponse from "../utils/sendResponse.js";

const notFoundMiddleware = (req, res) => {
  return sendResponse(res, {
    statusCode: 404,
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

export default notFoundMiddleware;
