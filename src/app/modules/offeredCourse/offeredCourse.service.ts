import type { OfferedCourse, Prisma } from "@prisma/client";
import { PaginationHelper } from "../../../helpers/pagination.helper";
import type { IPaginationOptions } from "../../../interfaces/pagination.interface";
import { prisma } from "../../../server";
import { asyncForEach } from "../../../shared/utils";
import { offeredCourseSearchableFields } from "./offeredCourse.constant";
import type {
  ICreateOfferedCourse,
  IOfferedCourseFilters,
} from "./offeredCourse.interface";

const insertToDB = async (data: ICreateOfferedCourse) => {
  const { academicDepartmentId, courseIds, semesterRegistrationId } = data;
  const result: OfferedCourse[] = [];

  await asyncForEach(courseIds, async (courseId: string) => {
    const isExist = await prisma.offeredCourse.findFirst({
      where: {
        academicDepartmentId,
        courseId,
        semesterRegistrationId,
      },
    });

    if (!isExist) {
      const insertOfferedCourse = await prisma.offeredCourse.create({
        data: {
          academicDepartmentId,
          courseId,
          semesterRegistrationId,
        },
        include: {
          academicDepartment: true,
          course: true,
          semesterRegistration: true,
        },
      });
      result.push(insertOfferedCourse);
    }
  });

  return result;
};

const getAllFromDB = async (
  filters: IOfferedCourseFilters,
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
      OR: offeredCourseSearchableFields.map((field) => ({
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

  const whereCondition: Prisma.OfferedCourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.offeredCourse.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: sortCondition,
  });
  const total = await prisma.offeredCourse.count();
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
  const result = await prisma.offeredCourse.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (id: string, payload: Partial<OfferedCourse>) => {
  const result = await prisma.offeredCourse.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string) => {
  const result = await prisma.offeredCourse.delete({
    where: {
      id,
    },
  });
  return result;
};

export const OfferedCourseService = {
  insertToDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
