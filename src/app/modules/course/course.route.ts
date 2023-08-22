import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CourseController } from "./course.controller";
import { CourseValidation } from "./course.validation";

const router = express.Router();

router.post(
  "/create-course",
  validateRequest(CourseValidation.createSchema),
  CourseController.insertToDB
);
router.get("/:id", CourseController.getByIdFromDB);
router.patch(
  "/:id",
  validateRequest(CourseValidation.updateSchema),
  CourseController.updateIntoDB
);
router.delete("/:id", CourseController.deleteFromDB);
router.get("/", CourseController.getAllFromDB);

export const CourseRoutes = router;
