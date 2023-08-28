export type IOfferedCourseFilters = {
  search?: string;
  id?: string;
};

export type ICreateOfferedCourse = {
  courseIds: string[];
  academicDepartmentId: string;
  semesterRegistrationId: string;
};
