import type { Prisma } from "@prisma/client";
import ApiError from "../../../errors/ApiError";
import { PaginationHelper } from "../../../helpers/pagination.helper";
import type { IPaginationOptions } from "../../../interfaces/pagination.interface";
import { prisma } from "../../../server";
import { asyncForEach } from "../../../shared/utils";
import { courseSearchableFields } from "./course.constant";
import type {
  ICourseCreateData,
  ICourseFilters,
  IPreRequisiteCourse,
} from "./course.interface";

const insertToDB = async (data: ICourseCreateData) => {
  const { preRequisiteCourses, ...courseData } = data;

  const newCourse = await prisma.$transaction(async (tx) => {
    const result = await tx.course.create({ data: courseData });

    if (!result) {
      throw new ApiError(400, "Unable to create course");
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      await asyncForEach(
        preRequisiteCourses,
        async (preRequisiteCourse: IPreRequisiteCourse) => {
          await tx.courseToPrerequisite.create({
            data: {
              courseId: result.id,
              prerequisiteId: preRequisiteCourse.courseId,
            },
          });
        }
      );
    }
    return result;
  });

  if (newCourse) {
    const responseData = await prisma.course.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {
        preRequisite: {
          include: {
            prerequisite: true,
          },
        },
        preRequisiteFor: {
          include: {
            course: true,
          },
        },
      },
    });
    return responseData;
  }
  throw new ApiError(400, "Unable to create course");
};

const getAllFromDB = async (
  filters: ICourseFilters,
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
      OR: courseSearchableFields.map((field) => ({
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

  const whereCondition: Prisma.CourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.course.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: sortCondition,
  });
  const total = await prisma.course.count();
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
  const result = await prisma.course.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<ICourseCreateData>
) => {
  const { preRequisiteCourses, ...courseData } = payload;
  const updateCourse = await prisma.$transaction(async (tx) => {
    const result = await tx.course.update({
      where: {
        id,
      },
      data: courseData,
    });

    if (!result) {
      throw new ApiError(400, "Unable to update course");
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletePrerequisites = preRequisiteCourses.filter(
        (course) => course.courseId && course.isDeleted
      );
      const newPrerequisites = preRequisiteCourses.filter(
        (course) => course.courseId && !course.isDeleted
      );

      // Delete
      if (deletePrerequisites.length > 0) {
        await asyncForEach(
          deletePrerequisites,
          async (deletePrerequisite: IPreRequisiteCourse) => {
            await tx.courseToPrerequisite.deleteMany({
              where: {
                AND: [
                  {
                    courseId: id,
                  },
                  {
                    prerequisiteId: deletePrerequisite.courseId,
                  },
                ],
              },
            });
          }
        );
      }
      // Add New Prerequisite
      if (newPrerequisites.length > 0) {
        await asyncForEach(
          newPrerequisites,
          async (newPrerequisite: IPreRequisiteCourse) => {
            await tx.courseToPrerequisite.create({
              data: {
                courseId: id,
                prerequisiteId: newPrerequisite.courseId,
              },
            });
          }
        );
      }
    }
    return result;
  });

  if (updateCourse) {
    const responseData = await prisma.course.findUnique({
      where: {
        id: updateCourse.id,
      },
      include: {
        preRequisite: {
          include: {
            prerequisite: true,
          },
        },
        preRequisiteFor: {
          include: {
            course: true,
          },
        },
      },
    });
    return responseData;
  }
};

const deleteFromDB = async (id: string) => {
  const result = await prisma.course.delete({
    where: {
      id,
    },
  });
  return result;
};

const assignFaculties = async (courseId: string, faculties: string[]) => {
  await prisma.courseFaculty.createMany({
    data: faculties.map((facultyId) => ({
      courseId,
      facultyId,
    })),
  });

  const assignFacultiesData = await prisma.courseFaculty.findMany({
    where: {
      courseId,
    },
    include: {
      faculty: true,
    },
  });
  return assignFacultiesData;
};

const removeFaculties = async (courseId: string, faculties: string[]) => {
  await prisma.courseFaculty.deleteMany({
    where: {
      courseId,
      facultyId: {
        in: faculties,
      },
    },
  });

  const remainingFacultiesData = await prisma.courseFaculty.findMany({
    where: {
      courseId,
    },
    include: {
      faculty: true,
    },
  });
  return remainingFacultiesData;
};

export const CourseService = {
  insertToDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  assignFaculties,
  removeFaculties,
};
