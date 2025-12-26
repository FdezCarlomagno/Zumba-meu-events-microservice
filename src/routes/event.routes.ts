import { Router } from "express"
import { EventController } from "../controllers/event.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import { validate } from "../middleware/validation.middleware"
import { createEventSchema, updateEventSchema, updateDatesSchema } from "../validators/event.validator"

const router = Router()
const eventController = new EventController()

// Public routes
router.get("/", (req, res) => eventController.getAll(req, res))
router.get("/:id", (req, res) => eventController.getById(req, res))

// Protected routes (require authentication)
router.post("/", authMiddleware, validate(createEventSchema), (req, res) => eventController.create(req, res))

router.put("/:id", authMiddleware, validate(updateEventSchema), (req, res) => eventController.update(req, res))

router.patch("/:id/dates", authMiddleware, validate(updateDatesSchema), (req, res) =>
  eventController.updateDates(req, res),
)

router.delete("/:id", authMiddleware, (req, res) => eventController.delete(req, res))

export default router
