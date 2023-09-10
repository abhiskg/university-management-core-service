import type { RequestHandler } from "express";
import { paginationFields } from "../../../constants/pagination.constant";
import ApiError from "../../../errors/ApiError";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import catchAsyncError from "../../middlewares/catchAsyncError";
import { semesterRegistrationFilterableFields } from "./semesterRegistration.constant";
import { SemesterRegistrationService } from "./semesterRegistration.service";

const insertToDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await SemesterRegistrationService.insertToDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
  });
});

const getAllFromDB: RequestHandler = catchAsyncError(async (req, res) => {
  const filters = pick(req.query, semesterRegistrationFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await SemesterRegistrationService.getAllFromDB(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "SemesterRegistration retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getByIdFromDB: RequestHandler = catchAsyncError(
  async (req, res, next) => {
    const result = await SemesterRegistrationService.getByIdFromDB(
      req.params.id
    );

    if (!result) {
      return next(new ApiError(404, "SemesterRegistration not found"));
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "SemesterRegistration retrieved successfully!",
      data: result,
    });
  }
);

const updateIntoDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await SemesterRegistrationService.updateIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "SemesterRegistration Updated successfully!",
    data: result,
  });
});

const deleteFromDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await SemesterRegistrationService.deleteFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "SemesterRegistration deleted successfully!",
    data: result,
  });
});

const startMyRegistration: RequestHandler = catchAsyncError(
  async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (req as any).user;
    const result = await SemesterRegistrationService.startMyRegistration(
      user.userId
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "SemesterRegistration deleted successfully!",
      data: result,
    });
  }
);

const enrollIntoCourse: RequestHandler = catchAsyncError(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (req as any).user;
  const result = await SemesterRegistrationService.enrollIntoCourse(
    user.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student course enrolled successfully!",
    data: result,
  });
});

const withdrawFromCourse: RequestHandler = catchAsyncError(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (req as any).user;
  const result = await SemesterRegistrationService.withdrawFromCourse(
    user.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student withdraw from course successfully!",
    data: result,
  });
});

export const SemesterRegistrationController = {
  insertToDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  startMyRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
};
