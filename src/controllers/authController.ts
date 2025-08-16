import { Request, Response } from "express";
import { AuthService } from "../services/authService";

export class AuthController {
  static async register(req: Request, res: Response): Promise<Response> {
    const { username, email, password, role, requireOTP } = req.body;

    if (!username || !email || !password || !role || requireOTP === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const result = await AuthService.register(
        username,
        email,
        password,
        role,
        requireOTP
      );
      return res
        .status(201)
        .json({ message: "User registered successfully", ...result });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const result = await AuthService.login(email, password);
      return res.status(200).json({ message: "Login successful", ...result });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
