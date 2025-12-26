import bcrypt from "bcrypt"
import { supabase } from "../config/database"
import { generateToken } from "../utils/jwt"
import type { LoginRequest, LoginResponse } from "../types"

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse | null> {
    // Get admin from database
    const { data: admin, error } = await supabase.from("admin_user").select("*").eq("username", credentials.username).single()

    if (error) {
      return null
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(credentials.password, admin.password_hash)

    if (!isPasswordValid) {
      return null
    }

    // Generate JWT token
    const token = generateToken({
      adminId: admin.id,
      username: admin.username,
    })

    return {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    }
  }
}
