import { Router } from "express"
import { AuthController } from "../controllers/auth.controller"
import { validate } from "../middleware/validation.middleware"
import { loginSchema } from "../validators/auth.validator"

const router = Router()
const authController = new AuthController()

router.post("/login", validate(loginSchema), (req, res) => authController.login(req, res))

export default router
