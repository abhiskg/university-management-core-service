export type ICourseFilters = {
  search?: string;
  title?: string;
  code?: string;
};

export type IPreRequisiteCourse = {
  courseId: string;
  isDeleted?: boolean;
};

export type ICourseCreateData = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: IPreRequisiteCourse[];
};
