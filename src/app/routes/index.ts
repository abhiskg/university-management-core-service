import express from "express";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";

const router = express.Router();

router.use("/academic-semesters", AcademicSemesterRoutes);
router.use("/academic-departments", AcademicDepartmentRoutes);

export const RootRoute = router;
