import type { RequestHandler } from "express";
import { paginationFields } from "../../../constants/pagination.constant";
import ApiError from "../../../errors/ApiError";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import catchAsyncError from "../../middlewares/catchAsyncError";
import { offeredCourseClassScheduleFilterableFields } from "./offeredCourseClassSchedule.constant";
import { OfferedCourseClassScheduleService } from "./offeredCourseClassSchedule.service";

const insertToDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await OfferedCourseClassScheduleService.insertToDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
  });
});

const getAllFromDB: RequestHandler = catchAsyncError(async (req, res) => {
  const filters = pick(req.query, offeredCourseClassScheduleFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await OfferedCourseClassScheduleService.getAllFromDB(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OfferedCourseClassSchedule retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getByIdFromDB: RequestHandler = catchAsyncError(
  async (req, res, next) => {
    const result = await OfferedCourseClassScheduleService.getByIdFromDB(
      req.params.id
    );

    if (!result) {
      return next(new ApiError(404, "OfferedCourseClassSchedule not found"));
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "OfferedCourseClassSchedule retrieved successfully!",
      data: result,
    });
  }
);

const updateIntoDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await OfferedCourseClassScheduleService.updateIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OfferedCourseClassSchedule Updated successfully!",
    data: result,
  });
});

const deleteFromDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await OfferedCourseClassScheduleService.deleteFromDB(
    req.params.id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OfferedCourseClassSchedule deleted successfully!",
    data: result,
  });
});

export const OfferedCourseClassScheduleController = {
  insertToDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
