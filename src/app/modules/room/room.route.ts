import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user.enum";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { RoomController } from "./room.controller";
import { RoomValidation } from "./room.validation";

const router = express.Router();

router.get("/:id", RoomController.getByIdFromDB);
router.get("/", RoomController.getAllFromDB);

router.post(
  "/create-room",
  validateRequest(RoomValidation.createSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  RoomController.insertToDB
);

router.patch(
  "/:id",
  validateRequest(RoomValidation.updateSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  RoomController.updateIntoDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  RoomController.deleteFromDB
);

export const RoomRoutes = router;
