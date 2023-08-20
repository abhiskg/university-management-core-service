import express from "express";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";

const router = express.Router();

router.use("/academic-semesters", AcademicSemesterRoutes);

export const RootRoute = router;
