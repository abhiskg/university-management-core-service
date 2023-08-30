import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user.enum";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseClassScheduleController } from "./offeredCourseClassSchedule.controller";
import { OfferedCourseClassScheduleValidation } from "./offeredCourseClassSchedule.validation";

const router = express.Router();

router.get("/:id", OfferedCourseClassScheduleController.getByIdFromDB);
router.get("/", OfferedCourseClassScheduleController.getAllFromDB);

router.post(
  "/create-offeredCourseClassSchedule",
  validateRequest(OfferedCourseClassScheduleValidation.createSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseClassScheduleController.insertToDB
);

router.patch(
  "/:id",
  validateRequest(OfferedCourseClassScheduleValidation.updateSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseClassScheduleController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseClassScheduleController.deleteFromDB
);

export const OfferedCourseClassScheduleRoutes = router;
