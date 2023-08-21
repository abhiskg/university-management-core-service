import { z } from "zod";

const createSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
  }),
});

const updateSchema = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
});

export const AcademicFacultyValidation = {
  createSchema,
  updateSchema,
};
