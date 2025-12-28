import type { Request, Response } from "express"
import { AuthService } from "../services/auth.service"
import { createResponse } from "../utils/responses"
import type { LoginRequest } from "../types"

const authService = new AuthService()

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: LoginRequest = req.body

      const result = await authService.login(credentials)

      if (!result) {
        createResponse(res, [], 401, "Invalid username or password", true)
        return
      }

      createResponse(res, result, 200, "Login successful", false)
    } catch (error) {
      console.error("Login error:", error)
      createResponse(res, error, 500, "Login failed", true)
    }
  }
}
