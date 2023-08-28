import type { RequestHandler } from "express";
import { paginationFields } from "../../../constants/pagination.constant";
import ApiError from "../../../errors/ApiError";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import catchAsyncError from "../../middlewares/catchAsyncError";
import { offeredCourseFilterableFields } from "./offeredCourse.constant";
import { OfferedCourseService } from "./offeredCourse.service";

const insertToDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await OfferedCourseService.insertToDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
  });
});

const getAllFromDB: RequestHandler = catchAsyncError(async (req, res) => {
  const filters = pick(req.query, offeredCourseFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await OfferedCourseService.getAllFromDB(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OfferedCourse retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getByIdFromDB: RequestHandler = catchAsyncError(
  async (req, res, next) => {
    const result = await OfferedCourseService.getByIdFromDB(req.params.id);

    if (!result) {
      return next(new ApiError(404, "OfferedCourse not found"));
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OfferedCourse retrieved successfully!",
      data: result,
    });
  }
);

const updateIntoDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await OfferedCourseService.updateIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OfferedCourse Updated successfully!",
    data: result,
  });
});

const deleteFromDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await OfferedCourseService.deleteFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OfferedCourse deleted successfully!",
    data: result,
  });
});

export const OfferedCourseController = {
  insertToDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
