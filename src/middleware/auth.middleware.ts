import type { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"
import { errorResponse } from "../utils/responses"
import type { AuthPayload } from "../types"

export interface AuthRequest extends Request {
  admin?: AuthPayload
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      errorResponse(res, "No token provided", 401)
      return
    }

    const token = authHeader.substring(7)

    try {
      const decoded = verifyToken(token)
      req.admin = decoded
      next()
    } catch (error) {
      errorResponse(res, "Invalid or expired token", 401)
      return
    }
  } catch (error) {
    errorResponse(res, "Authentication failed", 401)
    return
  }
}
