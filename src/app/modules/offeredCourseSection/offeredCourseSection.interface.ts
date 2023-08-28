export type IOfferedCourseSectionFilters = {
  search?: string;
  id?: string;
};

export type ICreateOfferedCourseSection = {
  title: string;
  maxCapacity: number;
  offeredCourseId: string;
};
