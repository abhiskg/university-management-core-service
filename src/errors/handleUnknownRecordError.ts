import type { Prisma } from "@prisma/client";

const handleUnknownRecordError = (
  error: Prisma.PrismaClientKnownRequestError
) => {
  const errorMessages = [
    {
      path: error.code,
      message: error.meta?.cause as string,
    },
  ];

  return {
    statusCode: 404,
    message: "Id not Found",
    errorMessages,
  };
};

export default handleUnknownRecordError;
