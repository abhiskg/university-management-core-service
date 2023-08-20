import type { RequestHandler } from "express";
import sendResponse from "../../../shared/sendResponse";
import catchAsyncError from "../../middlewares/catchAsyncError";
import { AcademicSemesterService } from "./academicSemester.service";

const insertToDb: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await AcademicSemesterService.insertToDb(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
  });
});

export const AcademicSemesterController = {
  insertToDb,
};
