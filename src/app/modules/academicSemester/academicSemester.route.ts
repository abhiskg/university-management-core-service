import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicSemesterController } from "./academicSemester.controller";
import { AcademicSemesterValidation } from "./academicSemester.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(AcademicSemesterValidation.createSchema),
  AcademicSemesterController.insertToDB
);
router.get("/:id", AcademicSemesterController.getByIdFromDB);
router.patch("/:id", AcademicSemesterController.updateIntoDB);
router.delete("/:id", AcademicSemesterController.deleteFromDB);
router.get("/", AcademicSemesterController.getAllFromDB);

export const AcademicSemesterRoutes = router;
