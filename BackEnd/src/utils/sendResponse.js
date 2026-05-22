const sendResponse = (
  res,
  {
    statusCode = 200,
    success = true,
    message = "Success",
    data = null,
    errors = null,
    meta = null,
  },
) => {
  return res.status(statusCode).json({
    success,
    message,
    errors,
    meta,
    data,
  });
};

export default sendResponse;
