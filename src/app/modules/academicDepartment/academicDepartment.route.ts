import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicDepartmentController } from "./academicDepartment.controller";
import { AcademicDepartmentValidation } from "./academicDepartment.validation";

const router = express.Router();

router.post(
  "/create-department",
  validateRequest(AcademicDepartmentValidation.createSchema),
  AcademicDepartmentController.insertToDB
);
router.get("/:id", AcademicDepartmentController.getByIdFromDB);
router.patch(
  "/:id",
  validateRequest(AcademicDepartmentValidation.updateSchema),
  AcademicDepartmentController.updateIntoDB
);
router.delete("/:id", AcademicDepartmentController.deleteFromDB);
router.get("/", AcademicDepartmentController.getAllFromDB);

export const AcademicDepartmentRoutes = router;
