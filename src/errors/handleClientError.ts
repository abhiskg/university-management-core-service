import type { Prisma } from "@prisma/client";
import type { IGenericErrorMessage } from "../interfaces/error.interface";

const handleClientError = (error: Prisma.PrismaClientKnownRequestError) => {
  let errorMessages: IGenericErrorMessage[] = [];
  let message = "";
  let statusCode = 400;

  if (error.code === "P2025") {
    message = (error.meta?.cause as string) || "Record not found!";
    statusCode = 404;
    errorMessages = [
      {
        path: "",
        message,
      },
    ];
  } else if (error.code === "P2003") {
    if (error.message.includes("delete()` invocation:")) {
      message = "Delete failed";
      errorMessages = [
        {
          path: "",
          message,
        },
      ];
    }
  }

  return {
    statusCode,
    message,
    errorMessages,
  };
};

export default handleClientError;
