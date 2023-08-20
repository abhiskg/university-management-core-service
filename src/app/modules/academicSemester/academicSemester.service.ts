import type { AcademicSemester } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const insertToDb = async (data: AcademicSemester) => {
  const result = await prisma.academicSemester.create({ data });
  return result;
};

export const AcademicSemesterService = {
  insertToDb,
};
