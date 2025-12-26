import dotenv from "dotenv"

dotenv.config()

export const env = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseServiceRole: process.env.SUPABASE_SERVICE_ROLE!,
  jwtSecret: process.env.JWT_SECRET! as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as "1h" | "1d" | "7d" || "7d",
}

// Validate required environment variables
const requiredEnvVars = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE", "JWT_SECRET"]

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName])

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`)
}
