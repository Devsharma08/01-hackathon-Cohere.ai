import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err); // 📋 Logs the error to the console for debugging
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const msg = err.message || "Something went wrong, try again later.";
  res.status(statusCode).json({ msg }); // ❌ Sends error response to the client
};

export default errorHandlerMiddleware;
