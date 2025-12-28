import type { Response } from "express"

export const createResponse = (res: Response, data: any, statusCode = 200, message?: string, error: boolean = false) => {
  return res.status(statusCode).json({
    error: error,
    message: message || "",
    data: data
  })
}
