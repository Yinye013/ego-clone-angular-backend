import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { userRepository } from "../repositories/user.repository";
import { User } from "../entities/user.entity";
import { OtpService } from "./otpService";
import { EmailService } from "./emailService";
import { profile } from "console";

export class AuthService {
  static async register(
    username: string,
    email: string,
    password: string,
    requireOTP: boolean,
    profileImage?: string,
    fullName?: string,
    mobilePhone?: string,
    status?: string,
    branch?: string,
    superUser?: boolean,
    systemRole?: string,
    address?: string
  ) {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with explicitly set values for all required fields
    const now = new Date();
    const userData = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      requireOTP,
      createdAt: now,
      updatedAt: now,
      profileImage,
      fullName,
      mobilePhone,
      status,
      branch,
      superUser,
      systemRole,
      address,
    };

    console.log("Creating user with data:", {
      ...userData,
      password: "[REDACTED]", // Don't log the password
    });

    const savedUser = await userRepository.createUser(userData);
    console.log("User saved successfully with ID:", savedUser.id);

    const { password: _, ...userWithoutPassword } = savedUser;
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { userId: savedUser.id, systemRole: savedUser.systemRole },
      jwtSecret,
      {
        expiresIn: "1h",
      }
    );

    return { user: userWithoutPassword, token };
  }

  static async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const { password: _, ...userWithoutPassword } = user;

    if (user.requireOTP) {
      const otp = OtpService.generateOTP(user.id, user.email);
      await EmailService.sendOtpEmail(user.email, otp);
      return { user: userWithoutPassword, message: "OTP sent to your email" };
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { userId: user.id, systemRole: user.systemRole },
      jwtSecret,
      {
        expiresIn: "1h",
      }
    );

    return { user: userWithoutPassword, token };
  }

  static async getAllUsers(): Promise<User[]> {
    return userRepository.findAll();
  }

  static async getUserById(id: string): Promise<User | null> {
    return userRepository.findById(id);
  }

  static async updateUserStatus(id: string, status: string): Promise<User> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    user.status = status;
    return userRepository.updateUser(user);
  }

  static async verifyOtp(userId: string, otp: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isValidOtp = OtpService.verifyOTP(user.id, otp);
    if (!isValidOtp) {
      throw new Error("Invalid OTP");
    }

    // user.requireOTP = true;
    // const updatedUser = await userRepository.updateUser(user);

    const { password: _, ...userWithoutPassword } = user;

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { userId: user.id, systemRole: user.systemRole },
      jwtSecret,
      {
        expiresIn: "1h",
      }
    );

    return { user: userWithoutPassword, token };
  }
}
