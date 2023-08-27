import type { Faculty, Prisma } from "@prisma/client";
import { PaginationHelper } from "../../../helpers/pagination.helper";
import type { IPaginationOptions } from "../../../interfaces/pagination.interface";
import { prisma } from "../../../server";
import { facultySearchableFields } from "./faculty.constant";
import type { IFacultyFilters } from "./faculty.interface";

const insertToDB = async (data: Faculty) => {
  const result = await prisma.faculty.create({ data });
  return result;
};

const getAllFromDB = async (
  filters: IFacultyFilters,
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
      OR: facultySearchableFields.map((field) => ({
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

  const whereCondition: Prisma.FacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.faculty.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: sortCondition,
    include: {
      academicFaculty: true,
    },
  });
  const total = await prisma.faculty.count();
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
  const result = await prisma.faculty.findUnique({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
    },
  });
  return result;
};

const updateIntoDB = async (id: string, payload: Partial<Faculty>) => {
  const result = await prisma.faculty.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string) => {
  const result = await prisma.faculty.delete({
    where: {
      id,
    },
  });
  return result;
};

const assignCourses = async (facultyId: string, courses: string[]) => {
  await prisma.courseFaculty.createMany({
    data: courses.map((courseId) => ({
      facultyId,
      courseId,
    })),
  });

  const assignCoursesData = await prisma.courseFaculty.findMany({
    where: {
      facultyId,
    },
    include: {
      course: true,
    },
  });
  return assignCoursesData;
};

const removeCourses = async (facultyId: string, courses: string[]) => {
  await prisma.courseFaculty.deleteMany({
    where: {
      facultyId,
      courseId: {
        in: courses,
      },
    },
  });

  const remainingCoursesData = await prisma.courseFaculty.findMany({
    where: {
      facultyId,
    },
    include: {
      course: true,
    },
  });
  return remainingCoursesData;
};

export const FacultyService = {
  insertToDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  assignCourses,
  removeCourses,
};
