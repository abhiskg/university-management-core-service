import express from "express";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { BuildingRoutes } from "../modules/building/building.route";
import { CourseRoutes } from "../modules/course/course.route";
import { FacultyRoutes } from "../modules/faculty/faculty.route";
import { OfferedCourseRoutes } from "../modules/offeredCourse/offeredCourse.route";
import { RoomRoutes } from "../modules/room/room.route";
import { SemesterRegistrationRoutes } from "../modules/semesterRegistration/semesterRegistration.route";
import { StudentRoutes } from "../modules/student/student.route";

const router = express.Router();

router.use("/academic-semesters", AcademicSemesterRoutes);
router.use("/academic-departments", AcademicDepartmentRoutes);
router.use("/academic-faculties", AcademicFacultyRoutes);
router.use("/students", StudentRoutes);
router.use("/faculties", FacultyRoutes);
router.use("/buildings", BuildingRoutes);
router.use("/rooms", RoomRoutes);
router.use("/courses", CourseRoutes);
router.use("/semester-registrations", SemesterRegistrationRoutes);
router.use("/offered-courses", OfferedCourseRoutes);

export const RootRoute = router;
