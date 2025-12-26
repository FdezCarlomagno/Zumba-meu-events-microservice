import express, { type Application } from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import routes from "./routes"
import { errorHandler } from "./middleware/error.middleware"
import { env } from "./config/env"

const app: Application = express()

// Security middleware
app.use(helmet())
app.use(cors())

// Logging middleware
if (env.nodeEnv === "development") {
  app.use(morgan("dev"))
}

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api", routes)

// Error handling middleware (must be last)
app.use(errorHandler)

export default app
