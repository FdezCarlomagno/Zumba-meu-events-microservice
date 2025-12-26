import type { Request, Response } from "express"
import { AuthService } from "../services/auth.service"
import { successResponse, errorResponse } from "../utils/responses"
import type { LoginRequest } from "../types"

const authService = new AuthService()

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: LoginRequest = req.body

      const result = await authService.login(credentials)

      if (!result) {
        errorResponse(res, "Invalid username or password", 401)
        return
      }

      successResponse(res, result)
    } catch (error) {
      console.error("Login error:", error)
      errorResponse(res, "Login failed", 500)
    }
  }
}
