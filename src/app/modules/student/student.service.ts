import type { Prisma, Student } from "@prisma/client";
import { PaginationHelper } from "../../../helpers/pagination.helper";
import type { IPaginationOptions } from "../../../interfaces/pagination.interface";
import { prisma } from "../../../server";
import { studentSearchableFields } from "./student.constant";
import type { IStudentFilters } from "./student.interface";

const insertToDB = async (data: Student) => {
  const result = await prisma.student.create({ data });
  return result;
};

const getAllFromDB = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions
) => {
  const { page, limit, skip, sortCondition } =
    PaginationHelper.calculatePagination(paginationOptions, {
      limit: 10,
      page: 1,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  const { search, ...filtersData } = filters;
  const andConditions = [];

  if (search) {
    andConditions.push({
      OR: studentSearchableFields.map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => {
        return {
          [field]: {
            equals: value,
          },
        };
      }),
    });
  }

  const whereCondition: Prisma.StudentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.student.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: sortCondition,
    include: {
      academicFaculty: true,
    },
  });
  const total = await prisma.student.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string) => {
  const result = await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
    },
  });
  return result;
};

const updateIntoDB = async (id: string, payload: Partial<Student>) => {
  const result = await prisma.student.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string) => {
  const result = await prisma.student.delete({
    where: {
      id,
    },
  });
  return result;
};

export const StudentService = {
  insertToDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
