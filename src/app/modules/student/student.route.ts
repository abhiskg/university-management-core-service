import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { StudentController } from "./student.controller";
import { StudentValidation } from "./student.validation";

const router = express.Router();

router.post(
  "/create-student",
  validateRequest(StudentValidation.createSchema),
  StudentController.insertToDB
);
router.get("/:id", StudentController.getByIdFromDB);
router.patch(
  "/:id",
  validateRequest(StudentValidation.updateSchema),
  StudentController.updateIntoDB
);
router.delete("/:id", StudentController.deleteFromDB);
router.get("/", StudentController.getAllFromDB);

export const StudentRoutes = router;
