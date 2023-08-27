import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user.enum";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CourseController } from "./course.controller";
import { CourseValidation } from "./course.validation";

const router = express.Router();
router.get("/:id", CourseController.getByIdFromDB);
router.get("/", CourseController.getAllFromDB);

router.post(
  "/create-course",
  validateRequest(CourseValidation.createSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.insertToDB
);

router.patch(
  "/:id",
  validateRequest(CourseValidation.updateSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.deleteFromDB
);

router.post(
  "/:id/assign-faculties",
  validateRequest(CourseValidation.assignOrRemoveFacultySchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.assignFaculties
);
router.delete(
  "/:id/remove-faculties",
  validateRequest(CourseValidation.assignOrRemoveFacultySchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.removeFaculties
);

export const CourseRoutes = router;
