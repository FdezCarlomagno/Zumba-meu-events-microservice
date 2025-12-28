import type { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"
import { createResponse } from "../utils/responses"
import type { AuthPayload } from "../types"

export interface AuthRequest extends Request {
  admin?: AuthPayload
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      createResponse(res, null, 401, "No token provided", true)
      return
    }

    const token = authHeader.substring(7)

    try {
      const decoded = verifyToken(token)
      req.admin = decoded
      next()
    } catch (error) {
      createResponse(res, null, 401, "Invalid or expired token", true)
      return
    }
  } catch (error) {
    createResponse(res, error, 401, "Authentication failed", true)
    return
  }
}
