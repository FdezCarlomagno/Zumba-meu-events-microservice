import { z } from "zod"

const eventBaseSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().datetime("Invalid start date format"),
  endDate: z.string().datetime("Invalid end date format"),
  status: z.enum(["draft", "upcoming", "past", "cancelled"]),
  location: z.string().max(255).nullable().optional(),
  ctaText: z.string().max(100).nullable().optional(),
  ctaUrl: z.string().url("Invalid URL format").max(500).nullable().optional(),
  isFeatured: z.boolean().default(false),
})

export const createEventSchema = eventBaseSchema.refine(
  (data) => new Date(data.endDate) >= new Date(data.startDate),
  {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  }
)

export const updateEventSchema = eventBaseSchema
  .partial()
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate) {
      if (new Date(data.endDate) < new Date(data.startDate)) {
        ctx.addIssue({
          path: ["endDate"],
          message: "End date must be after or equal to start date",
          code: z.ZodIssueCode.custom,
        })
      }
    }
  })

export const updateDatesSchema = z
  .object({
    startDate: z.string().datetime("Invalid start date format"),
    endDate: z.string().datetime("Invalid end date format"),
  })
  .refine(
    (data) => new Date(data.endDate) >= new Date(data.startDate),
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    }
  )
