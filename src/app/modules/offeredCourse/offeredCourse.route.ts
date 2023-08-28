import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user.enum";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseController } from "./offeredCourse.controller";
import { OfferedCourseValidation } from "./offeredCourse.validation";

const router = express.Router();

router.get("/:id", OfferedCourseController.getByIdFromDB);
router.get("/", OfferedCourseController.getAllFromDB);

router.post(
  "/create-offeredCourse",
  validateRequest(OfferedCourseValidation.createSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseController.insertToDB
);

router.patch(
  "/:id",
  validateRequest(OfferedCourseValidation.updateSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseController.deleteFromDB
);

export const OfferedCourseRoutes = router;
