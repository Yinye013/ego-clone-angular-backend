import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validationMiddleware } from "../middleware/validation.mw";
const { register, login } = AuthController;

const router = Router();

router.post("/register", validationMiddleware.register, register);
router.post("/login", validationMiddleware.login, login);

export default router;
