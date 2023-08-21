import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BuildingValidation } from "./building.validation";
import { BuildingController } from "./building.controller";

const router = express.Router();

router.post(
  "/create-building",
  validateRequest(BuildingValidation.createSchema),
  BuildingController.insertToDB
);
router.get("/:id", BuildingController.getByIdFromDB);
router.patch(
  "/:id",
  validateRequest(BuildingValidation.updateSchema),
  BuildingController.updateIntoDB
);
router.delete("/:id", BuildingController.deleteFromDB);
router.get("/", BuildingController.getAllFromDB);

export const BuildingRoutes = router;
