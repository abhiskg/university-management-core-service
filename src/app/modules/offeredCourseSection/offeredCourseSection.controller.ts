import type { RequestHandler } from "express";
import { paginationFields } from "../../../constants/pagination.constant";
import ApiError from "../../../errors/ApiError";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import catchAsyncError from "../../middlewares/catchAsyncError";
import { offeredCourseSectionFilterableFields } from "./offeredCourseSection.constant";
import { OfferedCourseSectionService } from "./offeredCourseSection.service";

const insertToDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await OfferedCourseSectionService.insertToDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
  });
});

const getAllFromDB: RequestHandler = catchAsyncError(async (req, res) => {
  const filters = pick(req.query, offeredCourseSectionFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await OfferedCourseSectionService.getAllFromDB(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OfferedCourseSection retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getByIdFromDB: RequestHandler = catchAsyncError(
  async (req, res, next) => {
    const result = await OfferedCourseSectionService.getByIdFromDB(req.params.id);

    if (!result) {
      return next(new ApiError(404, "OfferedCourseSection not found"));
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OfferedCourseSection retrieved successfully!",
      data: result,
    });
  }
);

const updateIntoDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await OfferedCourseSectionService.updateIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OfferedCourseSection Updated successfully!",
    data: result,
  });
});

const deleteFromDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await OfferedCourseSectionService.deleteFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OfferedCourseSection deleted successfully!",
    data: result,
  });
});

export const OfferedCourseSectionController = {
  insertToDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
