import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user.enum";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyController } from "./faculty.controller";
import { FacultyValidation } from "./faculty.validation";

const router = express.Router();

router.get("/:id", FacultyController.getByIdFromDB);
router.get("/", FacultyController.getAllFromDB);

router.post(
  "/create-faculty",
  validateRequest(FacultyValidation.createSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.insertToDB
);

router.patch(
  "/:id",
  validateRequest(FacultyValidation.updateSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.deleteFromDB
);

router.post(":id/assign-courses", FacultyController.assignCourses);
router.delete(":id/remove-courses", FacultyController.removeCourses);

export const FacultyRoutes = router;
