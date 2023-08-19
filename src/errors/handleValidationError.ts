import type { Error } from "mongoose";
import type { IGenericErrorMessage } from "../interfaces/error.interface";
import type { IGenericErrorResponse } from "../interfaces/response.interface";

const handleValidationError = (
  err: Error.ValidationError
): IGenericErrorResponse => {
  const errorMessages: IGenericErrorMessage[] = Object.values(err.errors).map(
    (el) => {
      return {
        path: el?.path,
        message: el?.message,
      };
    }
  );

  return {
    statusCode: 400,
    message: "Validation Error",
    errorMessages,
  };
};

export default handleValidationError;
