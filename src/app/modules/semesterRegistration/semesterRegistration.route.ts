import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user.enum";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { SemesterRegistrationController } from "./semesterRegistration.controller";
import { SemesterRegistrationValidation } from "./semesterRegistration.validation";

const router = express.Router();

router.get("/:id", SemesterRegistrationController.getByIdFromDB);
router.get("/", SemesterRegistrationController.getAllFromDB);

router.post(
  "/create-SemesterRegistration",
  validateRequest(SemesterRegistrationValidation.createSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.insertToDB
);

router.patch(
  "/:id",
  validateRequest(SemesterRegistrationValidation.updateSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.deleteFromDB
);

router.post(
  "/start-registration",
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.startMyRegistration
);

router.post(
  "/enroll-into-course",
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.enrollIntoCourse
);

router.post(
  "/withdraw-from-course",
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.withdrawFromCourse
);

export const SemesterRegistrationRoutes = router;
