import type { Prisma } from "@prisma/client";
import type { IGenericErrorMessage } from "../interfaces/error.interface";
import type { IGenericErrorResponse } from "../interfaces/response.interface";

const handleValidationError = (
  error: Prisma.PrismaClientValidationError
): IGenericErrorResponse => {
  const errorMessages: IGenericErrorMessage[] = [
    {
      path: "",
      message: error.message,
    },
  ];

  return {
    statusCode: 400,
    message: "Validation Error",
    errorMessages,
  };
};

export default handleValidationError;
