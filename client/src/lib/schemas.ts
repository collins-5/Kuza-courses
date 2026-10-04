import { z } from "zod";

export const courseSchema = z.object({
  name: z
    .string()
    .min(1, "Course name is required.")
    .min(3, "Course name must be at least 3 characters long."),
  instructor: z
    .string()
    .min(1, "Instructor name is required.")
    .min(2, "Instructor name must be at least 2 characters long."),
  duration: z
    .string()
    .min(1, "Duration interval is required."),
  price: z.coerce
    .number({ message: "Price must be a valid number." })
    .min(0, "Price cannot be negative."),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
});

export type CourseFormValues = z.infer<typeof courseSchema>;