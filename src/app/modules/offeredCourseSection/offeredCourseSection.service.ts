import type { OfferedCourseSection, Prisma } from "@prisma/client";
import ApiError from "../../../errors/ApiError";
import { PaginationHelper } from "../../../helpers/pagination.helper";
import type { IPaginationOptions } from "../../../interfaces/pagination.interface";
import { prisma } from "../../../server";
import { offeredCourseSectionSearchableFields } from "./offeredCourseSection.constant";
import type {
  ICreateOfferedCourseSection,
  IOfferedCourseSectionFilters,
} from "./offeredCourseSection.interface";

const insertToDB = async (data: ICreateOfferedCourseSection) => {
  const { maxCapacity, offeredCourseId, title } = data;
  const isExistOfferedCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: offeredCourseId,
    },
  });

  if (!isExistOfferedCourse) {
    throw new ApiError(400, "Offered Course does not exist!");
  }

  const result = await prisma.offeredCourseSection.create({
    data: {
      maxCapacity,
      title,
      offeredCourseId,
      semesterRegistrationId: isExistOfferedCourse.semesterRegistrationId,
    },
  });

  return result;
};

const getAllFromDB = async (
  filters: IOfferedCourseSectionFilters,
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
      OR: offeredCourseSectionSearchableFields.map((field) => ({
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

  const whereCondition: Prisma.OfferedCourseSectionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.offeredCourseSection.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: sortCondition,
  });
  const total = await prisma.offeredCourseSection.count();
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
  const result = await prisma.offeredCourseSection.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<OfferedCourseSection>
) => {
  const result = await prisma.offeredCourseSection.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string) => {
  const result = await prisma.offeredCourseSection.delete({
    where: {
      id,
    },
  });
  return result;
};

export const OfferedCourseSectionService = {
  insertToDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
