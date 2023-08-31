export const offeredCourseClassScheduleSearchableFields = ["dayOfWeek"];

export const offeredCourseClassScheduleFilterableFields = [
  "search",
  "dayOfweek",
  "offeredCourseSectionId",
  "roomId",
  "facultyId",
];

export const offeredCourseClassScheduleRelationalFields = [
  "offeredCourseSectionId",
  "roomId",
  "facultyId",
  "semesterRegistrationId",
];

export const offeredCourseClassScheduleRelationalFieldsMapper: Record<
  string,
  string
> = {
  offeredCourseSectionId: "offeredCourseSection",
  roomId: "room",
  facultyId: "faculty",
  semesterRegistrationId: "semesterRegistration",
};

export const daysInWeek = [
  "SATURDAY",
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
] as const;
