import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { RoomController } from "./room.controller";
import { RoomValidation } from "./room.validation";

const router = express.Router();

router.post(
  "/create-room",
  validateRequest(RoomValidation.createSchema),
  RoomController.insertToDB
);
router.get("/:id", RoomController.getByIdFromDB);
router.patch(
  "/:id",
  validateRequest(RoomValidation.updateSchema),
  RoomController.updateIntoDB
);
router.delete("/:id", RoomController.deleteFromDB);
router.get("/", RoomController.getAllFromDB);

export const RoomRoutes = router;
