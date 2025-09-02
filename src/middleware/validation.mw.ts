import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }
    next();
  };
};

const registerSchema = z.object({
  username: z
    .string()
    .min(2)
    .max(20, "Username must be between 2 and 20 characters."),
  password: z
    .string()
    .min(6)
    .max(15, "Password must be between 6 and 15 characters."),
  email: z.string().email("Invalid email address."),
  requireOTP: z.boolean().optional().default(false),
  profileImage: z.string().optional(),
  fullName: z.string().optional(),
  mobilePhone: z.string().optional(),
  status: z.string().optional(),
  branch: z.string().optional(),
  superUser: z.boolean().optional().default(false),
  systemRole: z.string().optional(),
  address: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .min(6)
    .max(15, "Password must be between 6 and 15 characters."),
});

export const validationMiddleware = {
  register: validateRequest(registerSchema),
  login: validateRequest(loginSchema),
};
