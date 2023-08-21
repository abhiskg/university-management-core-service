import type { RequestHandler } from "express";
import sendResponse from "../../../shared/sendResponse";
import catchAsyncError from "../../middlewares/catchAsyncError";
import { AcademicSemesterService } from "./academicSemester.service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination.constant";
import { academicSemesterFilterableFields } from "./academicSemester.constant";

const insertToDb: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await AcademicSemesterService.insertToDb(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
  });
});

const getAllFromDb: RequestHandler = catchAsyncError(async (req, res) => {
  const filters = pick(req.query, academicSemesterFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await AcademicSemesterService.getAllFromDb(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Academic semester retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

export const AcademicSemesterController = {
  insertToDb,
  getAllFromDb,
};
