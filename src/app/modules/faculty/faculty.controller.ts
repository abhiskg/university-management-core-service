import type { RequestHandler } from "express";
import { paginationFields } from "../../../constants/pagination.constant";
import ApiError from "../../../errors/ApiError";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import catchAsyncError from "../../middlewares/catchAsyncError";
import { facultyFilterableFields } from "./faculty.constant";
import { FacultyService } from "./faculty.service";

const insertToDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await FacultyService.insertToDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
  });
});

const getAllFromDB: RequestHandler = catchAsyncError(async (req, res) => {
  const filters = pick(req.query, facultyFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await FacultyService.getAllFromDB(filters, paginationOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Faculty retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getByIdFromDB: RequestHandler = catchAsyncError(
  async (req, res, next) => {
    const result = await FacultyService.getByIdFromDB(req.params.id);

    if (!result) {
      return next(new ApiError(404, "Faculty not found"));
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Faculty retrieved successfully!",
      data: result,
    });
  }
);

const updateIntoDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await FacultyService.updateIntoDB(req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Faculty Updated successfully!",
    data: result,
  });
});

const deleteFromDB: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await FacultyService.deleteFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Faculty deleted successfully!",
    data: result,
  });
});

const assignCourses: RequestHandler = catchAsyncError(async (req, res) => {
  const facultyId = req.params.id;
  const courses = req.body.faculties;

  const result = await FacultyService.assignCourses(facultyId, courses);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course faculty assigned successfully!",
    data: result,
  });
});

const removeCourses: RequestHandler = catchAsyncError(async (req, res) => {
  const facultyId = req.params.id;
  const courses = req.body.faculties;

  const result = await FacultyService.removeCourses(facultyId, courses);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course faculty removed successfully!",
    data: result,
  });
});

export const FacultyController = {
  insertToDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  assignCourses,
  removeCourses,
};
