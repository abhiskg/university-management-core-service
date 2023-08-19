import type { SortOrder } from "mongoose";
import type { IPaginationOptions } from "../interfaces/pagination.interface";

const calculatePagination = (
  options: IPaginationOptions,
  defaultOptions: Required<IPaginationOptions>
) => {
  const page = Number(options.page) || defaultOptions.page;
  const limit = Number(options.limit) || defaultOptions.limit;
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || defaultOptions.sortBy;
  const sortOrder = options.sortOrder || defaultOptions.sortOrder;

  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  return {
    page,
    limit,
    skip,
    sortCondition,
  };
};

export const PaginationHelper = {
  calculatePagination,
};
