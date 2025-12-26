import { Router } from "express"
import authRoutes from "./auth.routes"
import eventRoutes from "./event.routes"

const router = Router()

router.use("/auth", authRoutes)
router.use("/events", eventRoutes)

// Health check endpoint
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

export default router
