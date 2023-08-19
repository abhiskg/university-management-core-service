import type { CastError } from "mongoose";
import type { IGenericErrorMessage } from "../interfaces/error.interface";
import type { IGenericErrorResponse } from "../interfaces/response.interface";

const handleCastError = (error: CastError): IGenericErrorResponse => {
  const errorMessages: IGenericErrorMessage[] = [
    {
      path: error.path,
      message: "Cast Error",
    },
  ];

  return {
    statusCode: 400,
    message: "Invalid ID",
    errorMessages,
  };
};

export default handleCastError;
