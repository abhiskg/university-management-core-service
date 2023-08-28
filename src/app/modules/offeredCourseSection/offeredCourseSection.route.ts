import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user.enum";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { OfferedCourseSectionController } from "./offeredCourseSection.controller";
import { OfferedCourseSectionValidation } from "./offeredCourseSection.validation";

const router = express.Router();

router.get("/:id", OfferedCourseSectionController.getByIdFromDB);
router.get("/", OfferedCourseSectionController.getAllFromDB);

router.post(
  "/create-offeredCourseSection",
  validateRequest(OfferedCourseSectionValidation.createSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseSectionController.insertToDB
);

router.patch(
  "/:id",
  validateRequest(OfferedCourseSectionValidation.updateSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseSectionController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseSectionController.deleteFromDB
);

export const OfferedCourseSectionRoutes = router;
