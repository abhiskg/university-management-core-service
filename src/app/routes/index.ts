import express from "express";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { BuildingRoutes } from "../modules/building/building.route";
import { FacultyRoutes } from "../modules/faculty/faculty.route";
import { RoomRoutes } from "../modules/room/room.route";
import { StudentRoutes } from "../modules/student/student.route";

const router = express.Router();

router.use("/academic-semesters", AcademicSemesterRoutes);
router.use("/academic-departments", AcademicDepartmentRoutes);
router.use("/academic-faculties", AcademicFacultyRoutes);
router.use("/students", StudentRoutes);
router.use("/faculties", FacultyRoutes);
router.use("/buildings", BuildingRoutes);
router.use("/rooms", RoomRoutes);

export const RootRoute = router;
