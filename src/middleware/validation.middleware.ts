import type { Request, Response, NextFunction } from "express"
import { z } from "zod"
import { createResponse } from "../utils/responses"

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }))
        res.status(400).json({
          error: true,
          message: "Validation failed",
          data: errors,
        })
        return
      }
      createResponse(res, [], 400, "Validation error", true)
      return
    }
  }
}
