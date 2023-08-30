import type { OfferedCourseClassSchedule, Prisma } from "@prisma/client";
import ApiError from "../../../errors/ApiError";
import { PaginationHelper } from "../../../helpers/pagination.helper";
import type { IPaginationOptions } from "../../../interfaces/pagination.interface";
import { prisma } from "../../../server";
import { hasTimeConflict } from "../../../shared/utils";
import { offeredCourseClassScheduleSearchableFields } from "./offeredCourseClassSchedule.constant";
import type { IOfferedCourseClassScheduleFilters } from "./offeredCourseClassSchedule.interface";

const insertToDB = async (data: OfferedCourseClassSchedule) => {
  const alreadyBookedRoomOnDay =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: data.dayOfWeek,
        room: {
          id: data.roomId,
        },
      },
    });

  if (alreadyBookedRoomOnDay.length > 0) {
    const existingSlots = alreadyBookedRoomOnDay.map((schedule) => ({
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      dayOfWeek: schedule.dayOfWeek,
    }));

    const newSlot = {
      startTime: data.startTime,
      endTime: data.endTime,
      dayOfWeek: data.dayOfWeek,
    };

    if (hasTimeConflict(existingSlots, newSlot)) {
      throw new ApiError(404, "Room is already booked");
    }
  }

  const result = await prisma.offeredCourseClassSchedule.create({
    data,
    include: {
      offeredCourseSection: true,
      faculty: true,
      room: true,
      semesterRegistration: true,
    },
  });

  return result;
};

const getAllFromDB = async (
  filters: IOfferedCourseClassScheduleFilters,
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
      OR: offeredCourseClassScheduleSearchableFields.map((field) => ({
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

  const whereCondition: Prisma.OfferedCourseClassScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.offeredCourseClassSchedule.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: sortCondition,
  });
  const total = await prisma.offeredCourseClassSchedule.count();
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
  const result = await prisma.offeredCourseClassSchedule.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<OfferedCourseClassSchedule>
) => {
  const result = await prisma.offeredCourseClassSchedule.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string) => {
  const result = await prisma.offeredCourseClassSchedule.delete({
    where: {
      id,
    },
  });
  return result;
};

export const OfferedCourseClassScheduleService = {
  insertToDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
