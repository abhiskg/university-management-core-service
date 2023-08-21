import type { RequestHandler } from "express";
import { paginationFields } from "../../../constants/pagination.constant";
import ApiError from "../../../errors/ApiError";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import catchAsyncError from "../../middlewares/catchAsyncError";
import { StudentService } from "./student.service";
import { studentFilterableFields } from "./student.constant";

const insertToDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await StudentService.insertToDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
  });
});

const getAllFromDB: RequestHandler = catchAsyncError(async (req, res) => {
  const filters = pick(req.query, studentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await StudentService.getAllFromDB(filters, paginationOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getByIdFromDB: RequestHandler = catchAsyncError(
  async (req, res, next) => {
    const result = await StudentService.getByIdFromDB(req.params.id);

    if (!result) {
      return next(new ApiError(404, "Student not found"));
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Student retrieved successfully!",
      data: result,
    });
  }
);

const updateIntoDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await StudentService.updateIntoDB(req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student Updated successfully!",
    data: result,
  });
});

const deleteFromDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await StudentService.deleteFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student deleted successfully!",
    data: result,
  });
});

export const StudentController = {
  insertToDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
