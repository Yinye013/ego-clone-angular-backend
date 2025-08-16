import { Request, Response } from "express";
import { AuthService } from "../services/authService";
const { register, login } = AuthService;

export class AuthController {
  static async register(req: Request, res: Response) {
    const { username, email, password, role, requireOTP } = req.body;

    if (!username || !email || !password || !role || requireOTP === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const result = await register(
        username,
        email,
        password,
        role,
        requireOTP
      );
      res
        .status(201)
        .json({ message: "User registered successfully", ...result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const result = await login(email, password);
      res.status(200).json({ message: "Login successful", ...result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
