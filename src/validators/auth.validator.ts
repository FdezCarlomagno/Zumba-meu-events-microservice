import { z } from "zod"

export const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(1, "Password is required"),
})
