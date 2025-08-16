import { Router } from "express";
import { AuthController } from "../controllers/authController";
const { register, login } = AuthController;

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
