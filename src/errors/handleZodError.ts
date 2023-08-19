import type { ZodError } from "zod";
import type { IGenericErrorMessage } from "../interfaces/error.interface";
import type { IGenericErrorResponse } from "../interfaces/response.interface";

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errorMessages: IGenericErrorMessage[] = error.issues.map((issue) => {
    return {
      message: issue.message,
      path: issue.path[issue.path.length - 1],
    };
  });

  return {
    statusCode: 400,
    message: "Validation Error",
    errorMessages,
  };
};

export default handleZodError;
