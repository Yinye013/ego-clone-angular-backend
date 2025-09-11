import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validationMiddleware } from "../middleware/validation.mw";
import authMw from "../middleware/auth.mw";

const router = Router();

router.post(
  "/register",
  authMw.authenticateToken,
  authMw.authorizeRoles("admin"),
  validationMiddleware.register,
  AuthController.register
);

router.post("/login", validationMiddleware.login, AuthController.login);
router.post("/verify-otp", AuthController.verifyOtp);
router.get(
  "/users",
  authMw.authenticateToken,
  authMw.authorizeRoles("admin"),
  AuthController.getAllUsers
);

router.get(
  "/users/:id",
  authMw.authenticateToken,
  authMw.authorizeRoles("admin"),
  AuthController.getUserById
);

router.put(
  "/users/:id/status",
  authMw.authenticateToken,
  authMw.authorizeRoles("admin"),
  AuthController.updateUserStatus
);

export default router;
