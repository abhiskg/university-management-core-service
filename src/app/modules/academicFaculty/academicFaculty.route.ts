import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyController } from "./academicFaculty.controller";
import { AcademicFacultyValidation } from "./academicFaculty.validation";

const router = express.Router();

router.post(
  "/create-faculty",
  validateRequest(AcademicFacultyValidation.createSchema),
  AcademicFacultyController.insertToDB
);
router.get("/:id", AcademicFacultyController.getByIdFromDB);
router.patch(
  "/:id",
  validateRequest(AcademicFacultyValidation.updateSchema),
  AcademicFacultyController.updateIntoDB
);
router.delete("/:id", AcademicFacultyController.deleteFromDB);
router.get("/", AcademicFacultyController.getAllFromDB);

export const AcademicFacultyRoutes = router;
