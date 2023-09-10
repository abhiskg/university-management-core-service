import {
  SemesterRegistrationStatus,
  type StudentSemesterRegistrationCourse,
} from "@prisma/client";
import ApiError from "../../../errors/ApiError";
import { prisma } from "../../../server";

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
    throw new ApiError(404, "Student  Not Found");
  }

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(404, "Semester Registration Not Found");
  }

  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
    include: {
      course: true,
    },
  });

  if (!offeredCourse) {
    throw new ApiError(404, "Offered Course Not Found");
  }

  const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
    where: {
      id: payload.offeredCourseSectionId,
    },
  });

  if (!offeredCourseSection) {
    throw new ApiError(404, "Offered Course Section Not Found");
  }

  if (
    offeredCourseSection.maxCapacity &&
    offeredCourseSection.currentlyEnrolledStudent &&
    offeredCourseSection.currentlyEnrolledStudent >=
      offeredCourseSection.maxCapacity
  ) {
    throw new ApiError(400, "Student capacity is full");
  }

  await prisma.$transaction(async (tsx) => {
    await tsx.studentSemesterRegistrationCourse.create({
      data: {
        studentId: student.id,
        semesterRegistrationId: semesterRegistration.id,
        offeredCourseId: payload.offeredCourseId,
        offeredCourseSectionId: payload.offeredCourseSectionId,
      },
    });

    await tsx.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          increment: 1,
        },
      },
    });

    await tsx.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: student.id,
        },
        semesterRegistration: {
          id: semesterRegistration.id,
        },
      },
      data: {
        totalCreditsTaken: {
          increment: offeredCourse.course.credits,
        },
      },
    });
  });

  return {
    message: "Successfully enrolled into course",
  };
};
const withdrawFromCourse = async (
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
    throw new ApiError(404, "Student  Not Found");
  }

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(404, "Semester Registration Not Found");
  }

  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
    include: {
      course: true,
    },
  });

  if (!offeredCourse) {
    throw new ApiError(404, "Offered Course Not Found");
  }

  await prisma.$transaction(async (tsx) => {
    await tsx.studentSemesterRegistrationCourse.delete({
      where: {
        semesterRegistrationId_studentId_offeredCourseId: {
          studentId: student.id,
          semesterRegistrationId: semesterRegistration.id,
          offeredCourseId: payload.offeredCourseId,
        },
      },
    });

    await tsx.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          decrement: 1,
        },
      },
    });

    await tsx.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: student.id,
        },
        semesterRegistration: {
          id: semesterRegistration.id,
        },
      },
      data: {
        totalCreditsTaken: {
          decrement: offeredCourse.course.credits,
        },
      },
    });
  });

  return {
    message: "Successfully withdraw from course",
  };
};

export const StudentSemesterRegistrationCourseService = {
  enrollIntoCourse,
  withdrawFromCourse,
};
