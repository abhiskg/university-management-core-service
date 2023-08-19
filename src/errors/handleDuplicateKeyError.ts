import type { IGenericErrorMessage } from "../interfaces/error.interface";
import type { IGenericErrorResponse } from "../interfaces/response.interface";

type MongooseError = {
  keyValue: Record<string, unknown>;
};

const handleDuplicateKeyError = (err: MongooseError): IGenericErrorResponse => {
  const errorMessages: IGenericErrorMessage[] = [
    {
      path: `${Object.keys(err.keyValue)}`,
      message: `Duplicate ${Object.keys(err.keyValue)} entered`,
    },
  ];

  return {
    statusCode: 400,
    message: "Duplicate key error",
    errorMessages,
  };
};

export default handleDuplicateKeyError;
