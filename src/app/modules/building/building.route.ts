import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user.enum";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { BuildingController } from "./building.controller";
import { BuildingValidation } from "./building.validation";

const router = express.Router();

router.get("/:id", BuildingController.getByIdFromDB);
router.get("/", BuildingController.getAllFromDB);

router.post(
  "/create-building",
  validateRequest(BuildingValidation.createSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BuildingController.insertToDB
);

router.patch(
  "/:id",
  validateRequest(BuildingValidation.updateSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BuildingController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  BuildingController.deleteFromDB
);

export const BuildingRoutes = router;
