import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validationMiddleware } from "../middleware/validation.mw";
import authMw from "../middleware/auth.mw";

const router = Router();

router.post(
  "/register",
  validationMiddleware.register,
  authMw.authenticateToken,
  authMw.authorizeRoles("admin"),
  AuthController.register
);
router.post("/login", validationMiddleware.login, AuthController.login);

export default router;
