import { z } from "zod";

const createSchema = z.object({
  body: z.object({
    roomNumber: z.string({
      required_error: "Room number is required",
    }),
    floor: z.string({
      required_error: "Floor is required",
    }),
    buildingId: z.string({
      required_error: "Building id is required",
    }),
  }),
});

const updateSchema = z.object({
  body: z.object({
    roomNumber: z.string().optional(),
    floor: z.string().optional(),
    buildingId: z.string().optional(),
  }),
});

export const RoomValidation = {
  createSchema,
  updateSchema,
};
