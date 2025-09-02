import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { profile } from "console";

export class AuthController {
  static async register(req: Request, res: Response): Promise<Response> {
    const {
      username,
      email,
      password,
      requireOTP,
      profileImage,
      fullName,
      mobilePhone,
      status,
      branch,
      superUser,
      systemRole,
      address,
    } = req.body;

    if (!username || !email || !password || requireOTP === undefined) {
      return res
        .status(400)
        .json({
          error: "Username, email, password, and requireOTP are required",
        });
    }

    try {
      const result = await AuthService.register(
        username,
        email,
        password,
        requireOTP,
        profileImage,
        fullName,
        mobilePhone,
        status,
        branch,
        superUser,
        systemRole,
        address
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
      if (result.user.requireOTP) {
        return res.status(200).json({
          message: "OTP required",
          user: result.user,
          userId: result.user.id,
          otpRequired: true,
        });
      }
      return res.status(200).json({ message: "Login successful", ...result });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await AuthService.getAllUsers();
      return res.status(200).json({
        message: "Users retrived successfully",
        users,
        count: users.length,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getUserById(req: Request, res: Response): Promise<Response> {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      const user = await AuthService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res
        .status(200)
        .json({ message: "User retrieved successfully", user });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async verifyOtp(req: Request, res: Response): Promise<Response> {
    const id = req.body?.id || req.body?.userId;
    const otp = req.body?.otp || req.body?.otpCode;

    console.log("Extracted values:", { id, otp });

    if (!id || !otp) {
      return res.status(400).json({ error: "User ID and OTP are required" });
    }

    try {
      const result = await AuthService.verifyOtp(id, otp);
      return res
        .status(200)
        .json({ message: "OTP verified successfully", ...result });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
