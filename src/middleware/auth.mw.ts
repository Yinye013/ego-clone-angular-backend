import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository";
import { User } from "../entities/user.entity";
import { decode } from "punycode";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: string;
    };

    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    req.user = { userId: decoded.userId, role: decoded.role };

    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid access token." });
    return;
  }
};

const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
};

export default { authenticateToken, authorizeRoles };
