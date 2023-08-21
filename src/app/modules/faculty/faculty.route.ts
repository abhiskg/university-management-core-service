import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { FacultyValidation } from "./faculty.validation";
import { FacultyController } from "./faculty.controller";

const router = express.Router();

router.post(
  "/create-faculty",
  validateRequest(FacultyValidation.createSchema),
  FacultyController.insertToDB
);
router.get("/:id", FacultyController.getByIdFromDB);
router.patch(
  "/:id",
  validateRequest(FacultyValidation.updateSchema),
  FacultyController.updateIntoDB
);
router.delete("/:id", FacultyController.deleteFromDB);
router.get("/", FacultyController.getAllFromDB);

export const FacultyRoutes = router;
