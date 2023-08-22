import { z } from "zod";

const createSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    code: z.number({
      required_error: "Code is required",
    }),
    credits: z.string({
      required_error: "Credits is required",
    }),
  }),
});

const updateSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    code: z.number().optional(),
    credits: z.string().optional(),
  }),
});

export const CourseValidation = {
  createSchema,
  updateSchema,
};
