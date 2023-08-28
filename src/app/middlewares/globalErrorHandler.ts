/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { Prisma } from "@prisma/client";
import type { ErrorRequestHandler } from "express";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import handleClientError from "../../errors/handleClientError";
import handleValidationError from "../../errors/handleValidationError";
import handleZodError from "../../errors/handleZodError";
import type { IGenericErrorMessage } from "../../interfaces/error.interface";
import { errorLogger } from "../../shared/logger";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  config.env === "development"
    ? console.log("globalErrorHandler", error)
    : errorLogger.error("globalErrorHandler", error);

  let statusCode = 500;
  let message = "Something went wrong!";
  let errorMessages: IGenericErrorMessage[] = [];

  if (error?.name === "ZodError") {
    const simplifiedError = handleZodError(error);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handleValidationError(error);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handleClientError(error);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = error.message
      ? [
          {
            path: "",
            message: error.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message;
    errorMessages = error.message
      ? [
          {
            path: "",
            message: error.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== "production" ? error?.stack : null,
  });

  next();
};

export default globalErrorHandler;
