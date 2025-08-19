import { FindManyOptions } from "./../../node_modules/typeorm/browser/find-options/FindManyOptions.d";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  UserRepository,
  userRepository,
} from "../repositories/user.repository";
import { User } from "../entities/user.entity";

export class AuthService {
  static async register(
    username: string,
    email: string,
    password: string,
    role: string,
    requireOTP: boolean
  ) {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.role = role;
    newUser.requireOTP = requireOTP;

    await userRepository.saveUser(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
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

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, {
      expiresIn: "1h",
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}
