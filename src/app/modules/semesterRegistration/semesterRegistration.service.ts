import {
  SemesterRegistrationStatus,
  type Prisma,
  type SemesterRegistration,
  type StudentSemesterRegistrationCourse,
} from "@prisma/client";
import ApiError from "../../../errors/ApiError";
import { PaginationHelper } from "../../../helpers/pagination.helper";
import type { IPaginationOptions } from "../../../interfaces/pagination.interface";
import { prisma } from "../../../server";
import { semesterRegistrationSearchableFields } from "./semesterRegistration.constant";
import type { ISemesterRegistrationFilters } from "./semesterRegistration.interface";

const insertToDB = async (data: SemesterRegistration) => {
  const isAnySemesterRegUpcomingOrOngoing =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });
  if (isAnySemesterRegUpcomingOrOngoing) {
    throw new ApiError(
      400,
      `There is already an ${isAnySemesterRegUpcomingOrOngoing.status} registration`
    );
  }
  const result = await prisma.semesterRegistration.create({ data });
  return result;
};

const getAllFromDB = async (
  filters: ISemesterRegistrationFilters,
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
      OR: semesterRegistrationSearchableFields.map((field) => ({
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

  const whereCondition: Prisma.SemesterRegistrationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.semesterRegistration.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: sortCondition,
  });
  const total = await prisma.semesterRegistration.count();
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
  const result = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<SemesterRegistration>
) => {
  const isExist = await prisma.semesterRegistration.findUnique({
    where: {
      id: payload.id,
    },
  });

  if (!isExist) {
    throw new ApiError(404, "Data not Found");
  }
  // UPCOMING > ONGOING >ENDED
  if (
    payload.status &&
    isExist.status === SemesterRegistrationStatus.UPCOMING &&
    payload.status !== SemesterRegistrationStatus.ONGOING
  ) {
    throw new ApiError(400, "Can only move from UPCOMING to ONGOING");
  }

  if (
    payload.status &&
    isExist.status === SemesterRegistrationStatus.ONGOING &&
    payload.status !== SemesterRegistrationStatus.ENDED
  ) {
    throw new ApiError(400, "Can only move from ONGOING to ENDED");
  }

  const result = await prisma.semesterRegistration.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicSemester: true,
    },
  });
  return result;
};

const deleteFromDB = async (id: string) => {
  const result = await prisma.semesterRegistration.delete({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });
  return result;
};

const startMyRegistration = async (authUserId: string) => {
  const studentInfo = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  if (!studentInfo) {
    throw new ApiError(404, "Student Info not found");
  }

  const semesterRegistrationInfo = await prisma.semesterRegistration.findFirst({
    where: {
      id: {
        in: [
          SemesterRegistrationStatus.ONGOING,
          SemesterRegistrationStatus.UPCOMING,
        ],
      },
    },
  });

  if (
    !semesterRegistrationInfo ||
    semesterRegistrationInfo?.status === SemesterRegistrationStatus.UPCOMING
  ) {
    throw new ApiError(400, "Registration is not started yet");
  }

  let studentRegistration = await prisma.studentSemesterRegistration.findFirst({
    where: {
      student: {
        id: studentInfo.id,
      },
      semesterRegistration: {
        id: semesterRegistrationInfo.id,
      },
    },
  });

  if (!studentRegistration) {
    studentRegistration = await prisma.studentSemesterRegistration.create({
      data: {
        student: {
          connect: {
            id: studentInfo.id,
          },
        },
        semesterRegistration: {
          connect: {
            id: semesterRegistrationInfo.id,
          },
        },
      },
    });
  }

  return {
    semesterRegistration: semesterRegistrationInfo,
    studentSemesterRegistration: studentRegistration,
  };
};

const enrollIntoCourse = async (
  authUserId: string,
  payload: Pick<
    StudentSemesterRegistrationCourse,
    "offeredCourseId" | "offeredCourseSectionId"
  >
) => {
  const student = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  if (!student) {
    throw new ApiError(400, "Student  Not Found");
  }

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(400, "Semester Registration Not Found");
  }

  const enrollCourse = await prisma.studentSemesterRegistrationCourse.create({
    data: {
      studentId: student.id,
      semesterRegistrationId: semesterRegistration.id,
      offeredCourseId: payload.offeredCourseId,
      offeredCourseSectionId: payload.offeredCourseSectionId,
    },
  });

  return enrollCourse;
};

export const SemesterRegistrationService = {
  insertToDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  startMyRegistration,
  enrollIntoCourse,
};
