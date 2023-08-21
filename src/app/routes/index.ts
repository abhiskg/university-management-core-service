import express from "express";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";

const router = express.Router();

router.use("/academic-semesters", AcademicSemesterRoutes);
router.use("/academic-departments", AcademicDepartmentRoutes);
router.use("/academic-faculties", AcademicFacultyRoutes);

export const RootRoute = router;
