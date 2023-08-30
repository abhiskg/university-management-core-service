import type { OfferedCourseClassSchedule } from "@prisma/client";
import ApiError from "../../../errors/ApiError";
import { prisma } from "../../../server";
import { hasTimeConflict } from "../../../shared/utils";

const checkRoomAvailable = async (data: OfferedCourseClassSchedule) => {
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
};

export const OfferedCourseClassScheduleUtils = {
  checkRoomAvailable,
};
