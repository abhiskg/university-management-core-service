export type ICourseFilters = {
  search?: string;
  title?: string;
  code?: string;
};

export type ICourseCreateData = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: {
    courseId: string;
  }[];
};
