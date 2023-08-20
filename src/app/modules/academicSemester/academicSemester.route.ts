import express from "express";
import { AcademicSemesterController } from "./academicSemester.controller";

const router = express.Router();

router.post("/", AcademicSemesterController.insertToDb);

export const AcademicSemesterRoutes = router;
