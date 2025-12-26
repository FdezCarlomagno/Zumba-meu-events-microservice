import jwt from "jsonwebtoken"
import { env } from "../config/env"
import type { AuthPayload } from "../types"

export const generateToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  })
}

export const verifyToken = (token: string): AuthPayload => {
  return jwt.verify(token, env.jwtSecret) as AuthPayload
}
