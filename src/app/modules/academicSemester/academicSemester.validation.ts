import { z } from "zod";
import {
  academicSemesterCodes,
  academicSemesterMonths,
  academicSemesterTitles,
} from "./academicSemester.constant";

const createSchema = z.object({
  body: z.object({
    title: z.enum(academicSemesterTitles, {
      required_error: "Title is required",
    }),
    year: z
      .string({
        required_error: "Year is required",
      })
      .min(4, { message: "Year has to of min 4 letter" }),
    code: z.enum([...academicSemesterCodes] as [string, ...string[]], {
      required_error: "Code is required",
    }),
    startMonth: z.enum(academicSemesterMonths, {
      required_error: "Start month is required",
    }),
    endMonth: z.enum(academicSemesterMonths, {
      required_error: "End month is required",
    }),
  }),
});

const updateSchema = z
  .object({
    body: z.object({
      title: z.enum(academicSemesterTitles).optional(),
      year: z
        .string()
        .min(4, { message: "Year has to of min 4 letter" })
        .optional(),
      code: z
        .enum([...academicSemesterCodes] as [string, ...string[]])
        .optional(),
      startMonth: z.enum(academicSemesterMonths).optional(),
      endMonth: z.enum(academicSemesterMonths).optional(),
    }),
  })
  .refine(
    (data) =>
      (data.body.title && data.body.code && data.body.year) ||
      (!data.body.title && !data.body.code && !data.body.year),
    {
      message: "Title, Code and Year should be provided together",
    }
  );

export const AcademicSemesterValidation = {
  createSchema,
  updateSchema,
};
